import React, { createContext, useContext, useState, useCallback } from "react";
import { PROJECTS } from "../data/mockData";
import { getProjectData } from "../data/projectData";
import { useLocalStorage } from "../hooks/useLocalStorage";

const KEY = "mmrda_active_project";

const ProjectContext = createContext({
  activeId: PROJECTS[0].id,
  setActiveId: () => {},
  projects: PROJECTS,
  addProject: () => {},
});

export function ProjectProvider({ children }) {
  const [activeId, setActiveIdState] = useLocalStorage(KEY, PROJECTS[0].id);
  const [projects, setProjects] = useState(PROJECTS);

  const setActiveId = useCallback((id) => {
    // Accept any id — fall back to first project in useActiveProject if not found
    setActiveIdState(id);
  }, [setActiveIdState]);

  const addProject = useCallback((project) => {
    setProjects((prev) => [...prev, project]);
    setActiveIdState(project.id);
  }, [setActiveIdState]);

  return (
    <ProjectContext.Provider value={{ activeId, setActiveId, projects, addProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useActiveProject() {
  const ctx = useContext(ProjectContext);
  const project = ctx.projects.find((p) => p.id === ctx.activeId) || ctx.projects[0];
  return { project, setActiveId: ctx.setActiveId, projects: ctx.projects, addProject: ctx.addProject };
}

// Returns the active project plus its per-project data bundle
// (documents, ownershipChain, validationChecks, riskFlags, govApis,
//  sampleChunks, chatResponses, fallbackChat, decision).
export function useProjectData() {
  const { project, projects, setActiveId, addProject } = useActiveProject();
  const data = getProjectData(project.id);
  return { project, data, projects, setActiveId, addProject };
}
