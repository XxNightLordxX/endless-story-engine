import { useState } from 'react';
import { useAppSelector } from '../hooks/useRedux';
import { Activity, Shield, Sword, Zap, Heart, Droplets, Eye, Sparkles, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, max, color }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
      </div>
      <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
    </div>
    {max && (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    )}
  </div>
);

const Stats = () => {
  const { stats, skills, abilities, inventory } = useAppSelector((state) => state.system);
  const [activeTab, setActiveTab] = useState<'stats' | 'skills' | 'abilities' | 'inventory'>('stats');

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading stats...
        </div>
      </div>
    );
  }

  const coreStats = [
    { icon: Activity, label: 'Level', value: stats.level, color: 'text-purple-600' },
    { icon: TrendingUp, label: 'Experience', value: `${stats.experience.toLocaleString()}/${stats.experienceToNext.toLocaleString()}`, color: 'text-blue-600' },
  ];

  const primaryStats = [
    { icon: Sword, label: 'Strength', value: stats.strength, color: 'text-red-600' },
    { icon: Activity, label: 'Agility', value: stats.agility, color: 'text-green-600' },
    { icon: Shield, label: 'Vitality', value: stats.vitality, color: 'text-yellow-600' },
    { icon: Sparkles, label: 'Intelligence', value: stats.intelligence, color: 'text-blue-600' },
    { icon: Eye, label: 'Perception', value: stats.perception, color: 'text-purple-600' },
  ];

  const vampireStats = [
    { icon: Droplets, label: 'Blood Essence', value: stats.bloodEssence, max: stats.maxBloodEssence, color: 'text-red-600' },
    { icon: Sparkles, label: 'Vampire Level', value: stats.vampireLevel, color: 'text-purple-600' },
    { icon: Heart, label: 'Regeneration', value: stats.regeneration, max: 10, color: 'text-pink-600' },
  ];

  const resourceStats = [
    { icon: Heart, label: 'Health', value: `${stats.health}/${stats.maxHealth}`, color: 'text-red-600' },
    { icon: Zap, label: 'Mana', value: `${stats.mana}/${stats.maxMana}`, color: 'text-blue-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Character Stats
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track Kael's progression across both worlds
          </p>
        </header>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'stats'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'skills'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveTab('abilities')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'abilities'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Abilities
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'inventory'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Inventory
          </button>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            {/* Core Stats */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Core Stats
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {coreStats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>
            </section>

            {/* Primary Stats */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Primary Attributes
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {primaryStats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>
            </section>

            {/* Vampire Stats */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Vampire Progenitor Traits
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {vampireStats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>
            </section>

            {/* Resource Stats */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Current Resources
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {resourceStats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-4">
            {skills.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                No skills unlocked yet
              </div>
            ) : (
              skills.map((skill) => (
                <div key={skill.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {skill.name}
                    </h3>
                    <span className="text-sm text-primary-600 font-medium">
                      Level {skill.level}/{skill.maxLevel}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{skill.description}</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-primary-600 h-3 rounded-full transition-all"
                      style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Abilities Tab */}
        {activeTab === 'abilities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {abilities.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
                No abilities unlocked yet
              </div>
            ) : (
              abilities.map((ability) => (
                <div key={ability.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      ability.type === 'active' ? 'bg-purple-600' : 'bg-blue-600'
                    }`}>
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {ability.name}
                      </h3>
                      <span className={`text-xs font-medium ${
                        ability.type === 'active' ? 'text-purple-600' : 'text-blue-600'
                      }`}>
                        {ability.type}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {ability.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    {ability.manaCost && (
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Mana Cost:</span>
                        <span className="text-blue-600">{ability.manaCost}</span>
                      </div>
                    )}
                    {ability.bloodEssenceCost && (
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Blood Essence:</span>
                        <span className="text-red-600">{ability.bloodEssenceCost}</span>
                      </div>
                    )}
                    {ability.cooldown && (
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Cooldown:</span>
                        <span>{ability.cooldown}s</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {inventory.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
                Inventory is empty
              </div>
            ) : (
              inventory.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                    item.rarity === 'legendary' ? 'bg-yellow-500' :
                    item.rarity === 'epic' ? 'bg-purple-500' :
                    item.rarity === 'rare' ? 'bg-blue-500' :
                    item.rarity === 'uncommon' ? 'bg-green-500' :
                    'bg-gray-400'
                  }`}>
                    <Sword className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white text-center mb-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center capitalize">
                    {item.rarity}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;