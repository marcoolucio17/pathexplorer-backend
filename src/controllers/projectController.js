const { fetchProjects, fechtProjectById, fecthaddProject, fetchUpdateProject} = require('../services/projectService');


const getProjects = async (req, res) => {
    try {
        const projects = await fetchProjects();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
}

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await fechtProjectById(id);
        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
        
    } catch (error) {
        res.status(500).json({ error: 'Error fetching project' });
    }
}

//Se agrega un nuevo proyecto a la base de datos 

const addProject = async (req, res) => {
    try{
        const project = req.body.project;
        console.log(project);
        const data = await fecthaddProject(project);
        res.status(201).json({ message: 'Project added successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Error adding project' });
    }
}

//Actualizar la información de un proyecto
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = req.body.project;
        const data = await fetchUpdateProject(id, project);
        res.status(200).json({ message: 'Project updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating project' });
    }
}
    
    

module.exports = { getProjects , getProjectById,addProject, updateProject};