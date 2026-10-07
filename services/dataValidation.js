/**
 * Data Validation Engine
 * Implements Requirement 5: Strict validation of official renewable energy observations
 * Prevents phantom figures, bad units, duplicate records, and impossible numbers.
 */

const VALID_UNITS = ['MW', 'GW', 'GWh', 'MU', '%', 'kWp', 'Tonnes'];
const AUTHORITATIVE_SOURCES = ['MNRE', 'CEA', 'Central Electricity Authority', 'Ministry of New and Renewable Energy', 'data.gov.in', 'NISE', 'NIWE', 'PIB', 'Ministry of Power'];

function validateRecord(record) {
  const errors = [];

  if (!record || typeof record !== 'object') {
    return { valid: false, errors: ['Record is not a valid object'] };
  }

  // 1. Mandatory Fields Check
  const requiredFields = ['id', 'source', 'source_url', 'metric', 'technology', 'state', 'value', 'unit', 'data_period', 'published_date', 'verification_status'];
  for (const field of requiredFields) {
    if (record[field] === undefined || record[field] === null || record[field] === '') {
      errors.push(`Missing mandatory field: ${field}`);
    }
  }

  // 2. Numeric and Non-Negative Check
  if (typeof record.value !== 'number' || !Number.isFinite(record.value)) {
    errors.push(`Value must be a valid finite number, received: ${record.value}`);
  } else if (record.value < 0) {
    errors.push(`Impossible negative value detected: ${record.value} ${record.unit}`);
  }

  // 3. Unit Check
  if (record.unit && !VALID_UNITS.includes(record.unit)) {
    errors.push(`Invalid unit: '${record.unit}'. Expected one of: ${VALID_UNITS.join(', ')}`);
  }

  // 4. Source Check
  if (record.source) {
    const isAuth = AUTHORITATIVE_SOURCES.some(auth => record.source.toLowerCase().includes(auth.toLowerCase()));
    if (!isAuth) {
      errors.push(`Source '${record.source}' is not recognized as an authoritative Indian institution.`);
    }
  }

  // 5. Verification Status Check
  const validStatuses = ['official', 'calculated', 'simulation'];
  if (record.verification_status && !validStatuses.includes(record.verification_status)) {
    errors.push(`Invalid verification status '${record.verification_status}'. Must be official, calculated, or simulation.`);
  }

  // 6. National vs State Scope Check
  const isNational = record.state === 'India';
  const scope = isNational ? 'national' : 'state';

  return {
    valid: errors.length === 0,
    errors,
    scope
  };
}

function validateDataset(dataset) {
  if (!Array.isArray(dataset)) {
    return {
      valid: false,
      totalRecords: 0,
      validRecords: 0,
      errors: ['Dataset is not an array'],
      duplicates: [],
      timestamp: new Date().toISOString()
    };
  }

  const datasetErrors = [];
  const seenIds = new Set();
  const seenKeys = new Set();
  const duplicates = [];
  let validCount = 0;

  dataset.forEach((record, idx) => {
    // Check ID uniqueness
    if (record.id) {
      if (seenIds.has(record.id)) {
        duplicates.push(`Duplicate ID: ${record.id} at index ${idx}`);
      } else {
        seenIds.add(record.id);
      }
    }

    // Check logical composite uniqueness: (state + metric + technology + data_period)
    const compositeKey = `${record.state}_${record.metric}_${record.technology}_${record.data_period}`.toLowerCase();
    if (seenKeys.has(compositeKey)) {
      duplicates.push(`Duplicate observation for key: ${compositeKey}`);
    } else {
      seenKeys.add(compositeKey);
    }

    const itemValidation = validateRecord(record);
    if (!itemValidation.valid) {
      datasetErrors.push({
        index: idx,
        id: record.id || `row_${idx}`,
        errors: itemValidation.errors
      });
    } else {
      validCount++;
    }
  });

  return {
    valid: datasetErrors.length === 0 && duplicates.length === 0,
    totalRecords: dataset.length,
    validRecords: validCount,
    errors: datasetErrors,
    duplicates,
    status: (datasetErrors.length === 0 && duplicates.length === 0) ? 'verified' : 'failed',
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  validateRecord,
  validateDataset,
  VALID_UNITS,
  AUTHORITATIVE_SOURCES
};
