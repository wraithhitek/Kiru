import { FeatureLayout } from "../components/FeatureLayout";
import { FolderPlus, Sparkles, Folder, FileCode } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function ProjectGenerator() {
  const [projectType, setProjectType] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const projectTypes = [
    { id: 'web', name: 'Web Application', icon: '🌐' },
    { id: 'api', name: 'REST API', icon: '⚡' },
    { id: 'cli', name: 'CLI Tool', icon: '💻' },
    { id: 'data', name: 'Data Analysis', icon: '📊' }
  ];
  
  const handleGenerate = async () => {
    if (!projectType || !description) return;
    
    setIsGenerating(true);
    try {
      console.log('Sending project generation request:', { projectType, description });
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/project-generator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectType, description }),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.project) {
        setProject(data.project);
      } else {
        console.error('Invalid response format:', data);
        setProject({
          name: 'Error',
          structure: [],
          nextSteps: [data.error || 'Failed to generate project. Please try again.']
        });
      }
    } catch (error) {
      console.error('Error generating project:', error);
      setProject({
        name: 'Error',
        structure: [],
        nextSteps: ['Failed to generate project. Please try again.']
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const renderStructure = (items: any[], level = 0) => {
    if (!items || !Array.isArray(items)) return null;
    
    return items.map((item, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.05 }}
        className="mb-1"
        style={{ marginLeft: `${level * 20}px` }}
      >
        <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-blue-500/10 transition-colors">
          {item.type === 'folder' ? (
            <Folder className="w-4 h-4 text-amber-500" />
          ) : (
            <FileCode className="w-4 h-4 text-blue-500" />
          )}
          <span className="text-sm font-medium" style={{ fontFamily: 'monospace' }}>
            {item.name}
          </span>
          {item.description && (
            <span className="text-xs text-muted-foreground ml-2">
              {item.description}
            </span>
          )}
        </div>
        {item.children && renderStructure(item.children, level + 1)}
      </motion.div>
    ));
  };
  
  return (
    <FeatureLayout
      title="Project Generator"
      subtitle="Generate complete project structures with best practices"
      icon={<FolderPlus className="w-8 h-8 text-white" strokeWidth={1.5} />}
      gradientClass="bg-gradient-to-br from-blue-500 to-purple-500"
    >
      <div className="grid grid-cols-[400px_1fr] gap-6">
        {/* Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          <h3 
            className="text-sm text-muted-foreground mb-4"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Project Type
          </h3>
          
          <div className="grid grid-cols-2 gap-2 mb-6">
            {projectTypes.map((type, idx) => (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProjectType(type.id)}
                className={`p-4 rounded-xl transition-all ${
                  projectType === type.id
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-secondary hover:bg-blue-500/10 text-foreground'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-sm font-medium" style={{ fontFamily: 'var(--font-sans)' }}>
                  {type.name}
                </div>
              </motion.button>
            ))}
          </div>
          
          <h3 
            className="text-sm text-muted-foreground mb-4"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Description
          </h3>
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project (e.g., 'A blog with user authentication and markdown support')"
            className="w-full h-32 p-4 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none mb-4"
            style={{ fontFamily: 'var(--font-sans)' }}
          />
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={!projectType || !description || isGenerating}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}
          >
            {isGenerating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Project
              </>
            )}
          </motion.button>
        </motion.div>
        
        {/* Project Structure */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border p-6"
        >
          {project ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  {project.name}
                </h3>
                <div className="h-0.5 w-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" />
              </div>
              
              <div>
                <h4 
                  className="text-sm text-muted-foreground mb-3"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
                >
                  Project Structure
                </h4>
                <div className="bg-secondary rounded-xl p-4">
                  {project.structure && Array.isArray(project.structure) && project.structure.length > 0 ? (
                    renderStructure(project.structure)
                  ) : (
                    <div className="text-muted-foreground text-sm">No structure available</div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 
                  className="text-sm text-muted-foreground mb-3"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
                >
                  Next Steps
                </h4>
                <ol className="space-y-2">
                  {project.nextSteps && Array.isArray(project.nextSteps) && project.nextSteps.map((step: string, idx: number) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-foreground pt-0.5" style={{ fontFamily: 'var(--font-sans)' }}>
                        {step}
                      </span>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Select a project type and add a description to generate
            </div>
          )}
        </motion.div>
      </div>
    </FeatureLayout>
  );
}
