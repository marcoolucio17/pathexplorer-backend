const { fetchProjects, fetchProjectById, fetchaddProject, fetchUpdateProject, fetchProjectsByNameCaseInsensitive,
    fetchProjectsBySkill } = require('../services/projectService');

//Función para utilizar la consulta de llamar todos los proyectos
const getProjects = async (req, res) => {
    try {
        const { projectName,skill } = req.query;    
        if (projectName) {
            
            const projects = await fetchProjectsByNameCaseInsensitive(projectName);
            return res.status(200).json(projects); 
        } 
        if (skill) {
            const projects = await fetchProjectsBySkill(skill);
            return res.status(200).json(projects);
        } 
        const projects = await fetchProjects();
        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching projects' });
    }
}

//Función para utilizar la consulta de llamar un proyecto por id
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await fetchProjectById(id);
        if (project) {
            return  res.status(200).json(project);
        } else {
            return res.status(404).json({ error: 'Project not found' });
        }
        
    } catch (error) {
        return res.status(500).json({ error: 'Error fetching project' });
    }
}

//Se agrega un nuevo proyecto a la base de datos 
const addProject = async (req, res) => {
    try{
        const project = req.body;
        if (!project) {
            return res.status(400).json({ error: 'Project data is required' });
        }
        const data = await fetchaddProject(project);
        res.status(201).json({ message: 'Project added successfully' });

    } catch (error) {
        return res.status(500).json({ error: 'Error adding project' });
    }
}

//Actualizar la información de un proyecto
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = req.body.project;
        const data = await fetchUpdateProject(id, project);
        if (data) {
            return res.status(204).json({ message: 'Goal updated successfully' });
        } else {
            return res.status(404).json({ error: 'Goal not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error updating project' });
    }
}

module.exports = { getProjects , getProjectById,addProject, updateProject};