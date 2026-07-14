import axios from "axios";

const API =
process.env.REACT_APP_API_URL;

export const getDepartments = async () => {

    const response =
    await axios.get(
        `${API}/departments`
    );

    return response.data.data;

};

export const addDepartment =
async (department)=>{

    const response =
    await axios.post(

        `${API}/departments`,

        department

    );

    return response.data;

};