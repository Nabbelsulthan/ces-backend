// const supabase = require("../../config/supabase");

// const getEmployees = async () => {

//     const { data, error } = await supabase
//         .from("employees")
//         .select(`
//             *,
//             departments(
//                 id,
//                 department_name
//             ),
//             designations(
//                 id,
//                 designation_name
//             )
//         `)
//         .order("employee_code");

//     if (error) throw error;

//     return data;
// };

// const createEmployee = async (employee) => {

//     const { data, error } = await supabase
//         .from("employees")
//         .insert([employee])
//         .select();

//     if (error) throw error;

//     return data;
// };

// module.exports = {
//     getEmployees,
//     createEmployee
// };


const supabase = require("../../config/supabase");

// Get All Employees
const getEmployees = async () => {

    const { data, error } = await supabase
        .from("employees")
        .select(`
            *,
            departments (
                id,
                department_name
            ),
            designations (
                id,
                designation_name
            )
        `)
        .order("employee_code");

    if (error) throw error;

    return data;
};

// Get Employee By ID
const getEmployeeById = async (id) => {

    const { data, error } = await supabase
        .from("employees")
        .select(`
            *,
            departments (
                id,
                department_name
            ),
            designations (
                id,
                designation_name
            )
        `)
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;
};

// Create Employee
const createEmployee = async (employee) => {

    const { data, error } = await supabase
        .from("employees")
        .insert([employee])
        .select();

    if (error) throw error;

    return data;
};

// Update Employee
const updateEmployee = async (id, employee) => {

    const { data, error } = await supabase
        .from("employees")
        .update(employee)
        .eq("id", id)
        .select();

    if (error) throw error;

    return data;
};

// Delete Employee
const deleteEmployee = async (id) => {

    const { data, error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id)
        .select();

    if (error) throw error;

    return data;
};

module.exports = {

    getEmployees,

    getEmployeeById,

    createEmployee,

    updateEmployee,

    deleteEmployee

};