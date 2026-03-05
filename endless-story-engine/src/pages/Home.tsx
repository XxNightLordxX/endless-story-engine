import { useNavigate } from 'react-router-dom';
import { BookOpen, Shield, Clock, Heart, Sparkles, Zap, Users } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: 'Infinite Storytelling',
      description: 'A never-ending narrative where every chapter is procedurally generated, coherent, and fresh.',
    },
    {
      icon: Shield,
      title: 'Dual-World Structure',
      description: 'Chapters alternate between real world and VR world, with worlds that begin to merge.',
    },
    {
      icon: Clock,
      title: 'Deterministic Narrative',
      description: 'Every reader experiences the exact same story—a shared global journey.',
    },
    {
      icon: Heart,
      title: 'Emotional Investment',
      description: 'Kael\'s mission is deeply personal. Save Yuna, find parents, uncover the truth.',
    },
    {
      icon: Sparkles,
      title: 'Game Progression',
      description: 'A live stat screen tracks Kael\'s growth: levels, skills, items, and vampire evolution.',
    },
    {
      icon: Zap,
      title: 'Stat-Merging',
      description: 'VR powers begin manifesting in reality. The line between worlds thins.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436fc0936a?w=1920')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Endless Story Engine
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              A fully deterministic, infinitely scalable narrative platform following Kael's journey across two merging worlds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/read')}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
              >
                Start Reading
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-transparent border-2 border-purple-500 hover:bg-purple-500/20 rounded-lg text-lg font-semibold transition-all"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Overview */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">The Story</h2>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-8 space-y-4">
            <p className="text-gray-300 text-lg leading-relaxed">
              <span className="text-purple-400 font-semibold">Kael</span> is a young man carrying grief, responsibility, and the weight of a life that never gave him answers. His sister <span className="text-purple-400 font-semibold">Yuna</span> lies in a coma after a devastating accident. Machines keep her alive. Kael visits every day, drowning in guilt and fear.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              One day, a VR headset appears at his apartment. No sender. No explanation. Just the device. When he logs into <span className="text-purple-400 font-semibold">Eclipsis Online</span>, a global VR MMORPG phenomenon, the system overrides his choices and assigns him a forbidden class: <span className="text-red-400 font-semibold">Vampire Progenitor</span>—a remnant of an abandoned expansion that should not exist.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              As Kael progresses, his in-game stats, skills, and abilities begin merging into his real body. His agility increases, his senses sharpen, his eyes adjust to darkness. Skills learned in the game influence his reflexes outside the headset. The line between worlds thins.
            </p>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-purple-400 font-semibold">The Goal:</p>
              <ul className="mt-2 space-y-2 text-gray-300">
                <li>• Save Yuna</li>
                <li>• Find his parents</li>
                <li>• Uncover the truth behind the Vampire Progenitor bloodline</li>
                <li>• Survive the convergence of two worlds</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-800/50 backdrop-blur rounded-xl p-6 hover:bg-gray-700/50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Begin Your Journey</h2>
          <p className="text-gray-400 mb-8">
            Join the shared global journey. Every reader experiences the same story—from the moment Kael receives the headset to the discovery of his true power.
          </p>
          <button
            onClick={() => navigate('/read')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Read Chapter 1
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2024 Endless Story Engine. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-gray-500 text-sm">A shared global journey</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;