const { get } = require('superagent');
const { 
    fetchProjects, 
    fetchProjectById, 
    fetchProjectsByName,
    fetchCreateProject,
    fetchUpdateProject } = require('../services/projectService');

//Función para utilizar la consulta de llamar todos los proyectos
const getProjects = async (req, res) => {
    try {
        const { projectName = null, idproyecto = null } = req.body || {};    
        if (projectName && !idproyecto) {
            getProjectsByName(req, res);
        }
        else if (!projectName && idproyecto) {
            getProjectById(req, res);
        } else if (!projectName && !idproyecto) { 
            getAllProjects(req, res);
        }    
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
}

const getAllProjects = async (req, res) => { 
    try {
        const projects = await fetchProjects();
    if (!projects) {
        res.status(404).json({ error: 'No projects found' });
    } else {
        res.status(200).json(projects);
    }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
}
    
const getProjectsByName = async (req, res) => { 
    try {    
        const { projectName } = req.body;
        const projects = await fetchProjectsByName(projectName);
        if (projects) {
            res.status(200).json(projects);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }   
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
}


//Función para utilizar la consulta de llamar un proyecto por id
const getProjectById = async (req, res) => {
    try {
        const { idproyecto } = req.body;
        const project = await fetchProjectById(idproyecto);
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
        const { informacion = null } = req.body || {};
        if (informacion) { 
            createFullProject(req, res);
        } else {
            res.status(400).json({ error: 'No project information provided' });
        }
        
    } catch (error) {
        res.status(500).json({ error: 'Error creating project' });
    }
}

const createFullProject = async (req, res) => {
    try {
        const { informacion } = req.body;
        const result = await fetchCreateProject(informacion);
        if (!result) {
            res.status(404).json({ error: 'Project not found' });
        } else {
            res.status(201).json(result);
        }
        
    } catch (error) {
        res.status(500).json({ error: 'Error creating project' });
    }
}

const updateProject = async (req, res) => {
    try {
        const { idproyecto = null } = req.body || {};
        const { proyect = null } = req.body.informacion || {};
        if (idproyecto && proyect) {
            updatingProject(req, res);
        } else {
            res.status(400).json({ error: 'No project information provided' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error updating project' });
    }
}

const updatingProject = async (req, res) => {
    try {
        const { idproyecto } = req.body;
        const { proyecto } = req.body.informacion;
        const result = await fetchUpdateProject(idproyecto, proyecto);
        if (result) {
            res.status(200).json(result);   
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
         
    } catch (error) {
         res.status(500).json({ error: 'Error updating project' });
    }
}

module.exports = {
    getProjects,
    createProject,
    updateProject
};