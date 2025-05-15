const { 
    fetchProjects, 
    fetchProjectById, 
    fetchProjectsByName,
    fetchCreateProject } = require('../services/projectService');

//Función para utilizar la consulta de llamar todos los proyectos
const getProjects = async (req, res) => {
    try {
        const { projectName } = req.query;    
        if (projectName) {
            
            const projects = await fetchProjectsByName(projectName);
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

const createProject = async (req, res) => {
    try {
        const { informacion } = req.body;
        const result = await fetchCreateProject(informacion);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ error: 'Error creating project' });
    }
}

module.exports = { getProjects , getProjectById, createProject
};