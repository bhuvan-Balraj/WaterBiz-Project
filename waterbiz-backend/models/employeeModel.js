const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const getAllEmployees = async () => {
  const result = await db.query('SELECT * FROM employees ORDER BY created_at DESC');
  return result.rows;
};

const createEmployee = async (emp) => {
  const id = uuidv4();
  const result = await db.query(
    `INSERT INTO employees (
      employee_id, name, mobile, address, id_proof_type, id_proof_number,
      branch_name, designation, joining_date, updated_by
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [
      id, emp.name, emp.mobile, emp.address,
      emp.id_proof_type, emp.id_proof_number, emp.branch_name,
      emp.designation || null, emp.joining_date || null, emp.updated_by || null
    ]
  );
  return result.rows[0];
};

const updateEmployee = async (id, emp) => {
  const result = await db.query(
    `UPDATE employees SET 
      name=$1, mobile=$2, address=$3,
      id_proof_type=$4, id_proof_number=$5, branch_name=$6,
      designation=$7, joining_date=$8, updated_by=$9, updated_at=NOW()
     WHERE employee_id=$10 RETURNING *`,
    [
      emp.name, emp.mobile, emp.address, emp.id_proof_type, emp.id_proof_number,
      emp.branch_name, emp.designation, emp.joining_date, emp.updated_by, id
    ]
  );
  return result.rows[0];
};

const deleteEmployee = async (id) => {
  await db.query('DELETE FROM employees WHERE employee_id = $1', [id]);
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
