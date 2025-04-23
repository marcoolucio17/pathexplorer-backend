const {fetchProjects} = require('../services/projectService');
const {fetchProjectById} = require('../services/projectService');


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

module.exports = { getProjects , getProjectById};