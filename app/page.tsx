import { projects } from "./data/projects";
import ProjectCard from "./components/home/ProjectCard";

export default function Home() {
  return (
    <div>
      <h1>Dev Playground</h1>

      {projects.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </div>
  );
}