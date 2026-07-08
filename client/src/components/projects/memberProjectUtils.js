export const statusVariant = {
  ACTIVE: "success",
  INACTIVE: "warning",
};

export const getMemberProjectSummary = (projects) => {
  const totalTasks = projects.reduce(
    (total, project) => total + Number(project.totalTasks || 0),
    0
  );
  const completedTasks = projects.reduce(
    (total, project) => total + Number(project.completedTasks || 0),
    0
  );

  return {
    totalProjects: projects.length,
    activeProjects: projects.filter((project) => project.status === "ACTIVE")
      .length,
    totalTasks,
    completedTasks,
  };
};

export const buildMemberProjectViewModels = (projects, tasks) =>
  projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.projectName === project.name);
    const completedTasks = projectTasks.filter(
      (task) => task.status === "COMPLETED"
    ).length;
    const totalTasks = projectTasks.length;

    return {
      ...project,
      totalTasks,
      completedTasks,
      remainingTasks: totalTasks - completedTasks,
      progress:
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100),
    };
  });
