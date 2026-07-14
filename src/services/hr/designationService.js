const supabase = require("../../config/supabase");

// Get all designations with department details
const getDesignations = async () => {

    const { data, error } = await supabase
        .from("designations")
        .select(`
            *,
            departments (
                id,
                department_name
            )
        `)
        .order("designation_name");

    if (error) throw error;

    return data;
};

// Create designation
const createDesignation = async (designation) => {

    const { data, error } = await supabase
        .from("designations")
        .insert([designation])
        .select(`
            *,
            departments (
                id,
                department_name
            )
        `);

    if (error) throw error;

    return data;
};

module.exports = {

    getDesignations,

    createDesignation

};