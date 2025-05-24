const { 
    fetchProjects, 
    fetchProjectById, 
    fetchProjectsByName,
    fetchCreateProject,
    fetchUpdateProject } = require('../services/projectService');

//Función para utilizar la consulta de llamar todos los proyectos
const getProjects = async (req, res) => {
    try {
        const {
            projectName = null,
            idproyecto = null
        } = req.body || {}; 
        

        if (projectName && !idproyecto) {
            getProjectsByName(req,res);
        }
        else if (!projectName && idproyecto) {
            getProjectById(idproyecto, res);
        } else if (!projectName && !idproyecto) { 
            getAllProjects(req,res);
        }       
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
}

const getAllProjects = async (req,res) => { 
    try {
        const projects = await fetchProjects();
        if (projects) {
            getProjectsByFilter(req, res, projects);
           
        } else {
            res.status(404).json({ error: 'No projects found' });
            
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
}
    
const getProjectsByName = async (req,res) => { 
    try {    
        const {
            projectName = null
        } = req.body || {}; 
        const projects = await fetchProjectsByName(projectName);
        if (projects) {
             getProjectsByFilter(req, res, projects);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }   
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
}


//Función para utilizar la consulta de llamar un proyecto por id
const getProjectById = async (idproyecto, res) => {
    try {
        const project = await fetchProjectById(idproyecto);
        if (project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
        
    } catch (error) {
        res.status(500).json({ error: 'Error fetching project' });
    }
}

const getProjectsByFilter = async (req,res, projects) => {
     
    try {
        const { nombrerol = null, idcliente = null, idSkills = null } = req.body || {};

        const requiredSkills = idSkills ?? [];

        const projectsFiltered = projects
        .filter(project => {
            return !idcliente || project.cliente.idcliente === idcliente;
        })
        .map(project => {
    
            const rolesFiltrados = project.proyecto_roles.filter(role => {
                const datosRol = role.roles;
    
                if (nombrerol && datosRol.nombrerol !== nombrerol) return false;
    
                if (requiredSkills.length > 0) {
                    const habilidades = datosRol.requerimientos_roles.map(r => r.requerimientos.habilidades.idhabilidad);
                    const cumpleTodas = requiredSkills.every(idSkill => habilidades.includes(idSkill));
                
                    if (!cumpleTodas) return false;
                }
                return true;
    
            });

            return {
                ...project,
                proyecto_roles: rolesFiltrados
            };
        })
        .filter(project => project.proyecto_roles.length > 0);

        res.status(200).json(projectsFiltered);
        
        
    } catch (error) { 
        res.status(500).json({ error: 'Error fetching projects' });
    }

}


const createProject = async (req, res) => {
    try {
        const { informacion = null } = req.body || {};
        if (informacion) { 
            createFullProject(informacion, res);
        } else {
            res.status(400).json({ error: 'No project information provided' });
        }
        
    } catch (error) {
        res.status(500).json({ error: 'Error creating project' });
    }
}

const createFullProject = async (informacion, res) => {
    try {
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
            updatingProject(idproyecto,proyect, res);
        } else {
            res.status(400).json({ error: 'No project information provided' });
        }
    } catch (error) {
         res.status(500).json({ error: 'Error updating project' });
    }
}

const updatingProject = async (idproyecto,proyect, res) => {
    try {
        const result = await fetchUpdateProject(idproyecto, proyect);
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