const supabase = require("../../config/supabase");

// Get All
const getDepartments = async () => {

    const { data, error } = await supabase
        .from("departments")
        .select("*")
        .is("deleted_at", null)
        .order("department_name");

    if (error) throw error;

    return data;
};

// Get By Id
const getDepartmentById = async (id) => {

    const { data, error } = await supabase
        .from("departments")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    return data;
};

// Create
const createDepartment = async (department) => {

    const { data, error } = await supabase
        .from("departments")
        .insert([department])
        .select();

    if (error) throw error;

    return data;
};

// Update
const updateDepartment = async (id, body) => {

    const { data, error } = await supabase
        .from("departments")
        .update(body)
        .eq("id", id)
        .select();

    if (error) throw error;

    return data;
};

// Soft Delete
const deleteDepartment = async (id) => {

    const { data, error } = await supabase
        .from("departments")
        .update({
            status: false,
            deleted_at: new Date()
        })
        .eq("id", id)
        .select();

    if (error) throw error;

    return data;
};

module.exports = {
    getDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
};