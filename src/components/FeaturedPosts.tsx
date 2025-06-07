
import BlogCard from "./BlogCard";

const FeaturedPosts = () => {
  const featuredPosts = [
    {
      title: "The Future of Large Language Models: Beyond GPT-4",
      excerpt: "Exploring the next generation of AI models and their potential to revolutionize how we interact with technology. From multimodal capabilities to reasoning breakthroughs.",
      readTime: "12 min",
      difficulty: "Advanced" as const,
      tags: ["AI", "LLMs", "GPT-4", "Research"],
      date: "Dec 5, 2024",
      isRead: true,
      progress: 75
    },
    {
      title: "Quantum Computing Meets AI: A New Era of Possibilities",
      excerpt: "How quantum computers could accelerate machine learning algorithms and solve problems that are intractable for classical computers.",
      readTime: "8 min",
      difficulty: "Intermediate" as const,
      tags: ["Quantum", "AI", "Computing"],
      date: "Dec 3, 2024"
    },
    {
      title: "Building Ethical AI Systems: Lessons from DeepMind",
      excerpt: "An in-depth look at how leading AI research organizations are tackling bias, fairness, and transparency in artificial intelligence.",
      readTime: "15 min",
      difficulty: "Beginner" as const,
      tags: ["Ethics", "AI Safety", "DeepMind"],
      date: "Dec 1, 2024",
      isRead: true,
      progress: 100
    },
    {
      title: "The Rise of Autonomous Agents in Software Development",
      excerpt: "How AI agents are transforming coding, debugging, and software architecture. A practical guide to the tools reshaping development.",
      readTime: "10 min",
      difficulty: "Intermediate" as const,
      tags: ["Automation", "Coding", "Agents"],
      date: "Nov 28, 2024"
    },
    {
      title: "Neural Networks that Learn to Think: Chain-of-Thought Reasoning",
      excerpt: "Breaking down how modern AI models develop reasoning capabilities and what this means for problem-solving applications.",
      readTime: "18 min",
      difficulty: "Advanced" as const,
      tags: ["Reasoning", "Neural Networks", "CoT"],
      date: "Nov 25, 2024"
    },
    {
      title: "From Silicon to Synapse: Neuromorphic Computing Explained",
      excerpt: "Understanding brain-inspired computing architectures and their potential to create more efficient, adaptive AI systems.",
      readTime: "14 min",
      difficulty: "Intermediate" as const,
      tags: ["Neuromorphic", "Hardware", "Brain-AI"],
      date: "Nov 22, 2024"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Latest <span className="text-primary text-glow">Research</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dive deep into cutting-edge AI research, emerging technologies, and the innovations shaping our future.
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <div 
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BlogCard {...post} />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-16">
          <button className="glass px-8 py-4 rounded-xl hover:glow-hover transition-all duration-300 font-medium">
            Explore All Articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
