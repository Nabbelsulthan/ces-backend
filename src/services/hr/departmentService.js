const supabase = require("../../config/supabase");

const getDepartments = async () => {

    const { data, error } = await supabase
        .from("departments")
        .select("*")
        .order("department_name");

    if (error) throw error;

    return data;

};

const createDepartment = async (department) => {

    const { data, error } = await supabase
        .from("departments")
        .insert([department])
        .select();

    if (error) throw error;

    return data;

};

module.exports = {

    getDepartments,

    createDepartment

};