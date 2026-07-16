const supabase = require("../../config/supabase");

const getAttendance = async () => {

    const { data, error } = await supabase

        .from("attendance")

        .select(`
            *,
            employees(
                id,
                employee_code,
                first_name,
                last_name,
                departments(
                    department_name
                )
            )
        `)

        .order("attendance_date", {
            ascending: false
        });

    if (error) throw error;

    return data;

};

const createAttendance = async (attendance) => {

    const { data, error } = await supabase

        .from("attendance")

        .insert([attendance])

        .select();

    if (error) throw error;

    return data;

};

module.exports = {

    getAttendance,

    createAttendance

};