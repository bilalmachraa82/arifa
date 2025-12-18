import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Eye } from "lucide-react";
import { motion, Variants, Easing } from "framer-motion";
import { cn } from "@/lib/utils";
import { GeometricCardFrame } from "@/components/ui/GeometricFrame";
import { LazyImage } from "@/components/ui/lazy-image";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    category: string;
    location: string | null;
    area: string | null;
    year: string | null;
    status: string | null;
    description: string | null;
    featured_image: string | null;
    segment: string | null;
  };
  index: number;
}

const getFrameVariant = (segment: string | null): "default" | "coral" | "yellow" | "blue" => {
  switch (segment) {
    case "privado": return "coral";
    case "empresas": return "yellow";
    case "investidores": return "blue";
    default: return "default";
  }
};

const easeOut: Easing = [0.25, 0.1, 0.25, 1];

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/portfolio/${project.slug}`}
        className="group block relative"
      >
        <GeometricCardFrame variant={getFrameVariant(project.segment)} className="mb-5">
          <div className="relative overflow-hidden rounded-sm">
            <LazyImage
              src={project.featured_image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
              alt={project.title}
              aspectRatio="aspect-[4/5]"
              className="transition-transform duration-700 ease-out group-hover:scale-110"
            />
            
            {/* Overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Subtle permanent gradient at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-foreground/40 to-transparent" />
            
            {/* Status badge with micro-animation */}
            {project.status && (
              <motion.div 
                className="absolute top-4 left-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider rounded-full backdrop-blur-sm transition-all duration-300 group-hover:scale-105",
                  project.status === "Concluído"
                    ? "bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
                    : project.status === "Em construção"
                    ? "bg-arifa-yellow/90 text-foreground shadow-lg shadow-arifa-yellow/20"
                    : "bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
                )}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {project.status}
                </span>
              </motion.div>
            )}

            {/* Hover action buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              {/* View icon */}
              <div className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 shadow-lg">
                <Eye className="h-4 w-4 text-foreground" />
              </div>
              {/* Arrow icon */}
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 delay-75 shadow-lg shadow-accent/30">
                <ArrowRight className="h-4 w-4 text-accent-foreground transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>

            {/* Hover info overlay on bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <p className="text-xs text-background/80 line-clamp-2">
                {project.description || "Clique para ver mais detalhes"}
              </p>
            </div>
          </div>
        </GeometricCardFrame>

        {/* Card content with micro-interactions */}
        <div className="space-y-2 relative">
          {/* Category with underline animation */}
          <p className="text-caption text-accent relative inline-block">
            <span className="relative">
              {project.category}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
            </span>
          </p>
          
          {/* Title with color transition */}
          <h3 className="text-2xl font-bold text-foreground transition-colors duration-300 group-hover:text-accent">
            {project.title}
          </h3>
          
          {/* Metadata with stagger animation on hover */}
          <div className="flex items-center gap-4 text-small text-muted-foreground">
            {project.location && (
              <span className="flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-0.5">
                <MapPin className="h-4 w-4 transition-colors duration-300 group-hover:text-accent" />
                {project.location}
              </span>
            )}
            {project.area && (
              <span className="transition-transform duration-300 delay-75 group-hover:translate-x-0.5">
                {project.area}
              </span>
            )}
            {project.year && (
              <span className="transition-transform duration-300 delay-100 group-hover:translate-x-0.5">
                {project.year}
              </span>
            )}
          </div>
        </div>

        {/* Hover indicator line */}
        <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-accent/50 transition-all duration-500 group-hover:w-full rounded-full" />
      </Link>
    </motion.div>
  );
}

export default ProjectCard;
