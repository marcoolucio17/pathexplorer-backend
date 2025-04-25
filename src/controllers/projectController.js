const { fetchProjects, fetchProjectById, fetchaddProject, fetchUpdateProject, fetchProjectsByNameCaseInsensitive} = require('../services/projectService');

//Función para utilizar la consulta de llamar todos los proyectos
const getProjects = async (req, res) => {
    try {
        const { projectName } = req.query;
        if (projectName) {
            if (!projectName) {
                return res.status(400).json({ error: 'Project name is required' });
            }
            const projects = await fetchProjectsByNameCaseInsensitive(projectName);
            res.status(200).json(projects);
            
        } else {
            const projects = await fetchProjects();
            res.status(200).json(projects);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
}



//Función para utilizar la consulta de llamar un proyecto por id
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await fetchProjectById(id);
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
        const project = req.body;
        if (!project) {
            return res.status(400).json({ error: 'Project data is required' });
        }
        const data = await fetchaddProject(project);
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