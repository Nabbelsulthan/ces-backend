const supabase = require("../../config/supabase");

const getEmployees = async () => {

    const { data, error } = await supabase
        .from("employees")
        .select(`
            *,
            departments(
                id,
                department_name
            ),
            designations(
                id,
                designation_name
            )
        `)
        .order("employee_code");

    if (error) throw error;

    return data;
};

const createEmployee = async (employee) => {

    const { data, error } = await supabase
        .from("employees")
        .insert([employee])
        .select();

    if (error) throw error;

    return data;
};

module.exports = {
    getEmployees,
    createEmployee
};