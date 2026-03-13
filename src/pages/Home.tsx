import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Shield, Sparkles, Zap } from 'lucide-react';
import * as api from '../api';

const Home = () => {
  const navigate = useNavigate();
  const [chapterCount, setChapterCount] = useState(0);

  useEffect(() => {
    api.getChapters().then(({ total }) => setChapterCount(total)).catch(() => {});
  }, []);

  const features = [
    { icon: BookOpen, title: 'AI-Generated Chapters', description: 'Every chapter is written by Claude AI, maintaining story continuity and building on previous events.' },
    { icon: Shield, title: 'Dual-World Structure', description: 'Chapters alternate between the real world and Eclipsis Online VR, with worlds that begin to merge.' },
    { icon: Sparkles, title: 'Admin-Controlled Pacing', description: 'New chapters are only generated when the admin reads — keeping the story quality-controlled and intentional.' },
    { icon: Zap, title: 'LitRPG Elements', description: 'VR chapters include system notifications, stat progression, skill unlocks, and vampire abilities woven into the narrative.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Endless Story Engine
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              An AI-powered narrative platform following Kael's journey across two merging worlds.
            </p>
            <p className="text-lg text-gray-400 mb-8">
              {chapterCount > 0 ? `${chapterCount} chapter${chapterCount > 1 ? 's' : ''} available` : 'Begin the journey'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigate('/read/1')}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30">
                Start Reading
              </button>
              <button onClick={() => navigate('/login')}
                className="px-8 py-4 bg-transparent border-2 border-purple-500 hover:bg-purple-500/20 rounded-lg text-lg font-semibold transition-all">
                Sign In
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
              <span className="text-purple-400 font-semibold">Kael</span> is a young man carrying grief, responsibility, and the weight of a life without answers. His sister <span className="text-purple-400 font-semibold">Yuna</span> lies in a coma. Machines keep her alive. Kael visits every day.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              One day, a VR headset appears at his door. No sender. No explanation. When he logs into <span className="text-purple-400 font-semibold">Eclipsis Online</span>, the system assigns him a forbidden class: <span className="text-red-400 font-semibold">Vampire Progenitor</span> — a remnant of an abandoned expansion that should not exist.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              As Kael progresses, his in-game stats begin bleeding into reality. The line between worlds thins.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-800/50 backdrop-blur rounded-xl p-6 hover:bg-gray-700/50 transition-colors">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
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

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Begin Your Journey</h2>
          <p className="text-gray-400 mb-8">Start reading Chapter 1 and follow Kael's transformation.</p>
          <button onClick={() => navigate('/read/1')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
            Read Chapter 1
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">Endless Story Engine &mdash; AI-Powered Narrative Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
