
import React from 'react';
import { TEAM_STRUCTURE } from '../constants';
import Reveal from './Reveal';
import EditableImage from './EditableImage';

const Team: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Page Header */}
       <div className="bg-teal-800 dark:bg-teal-950 text-white pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <Reveal direction="down">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Notre Équipe</h1>
             </Reveal>
             <Reveal delay={0.2}>
                <p className="text-teal-100 text-xl max-w-2xl mx-auto">
                    Des professionnels dévoués à votre santé et votre bien-être.
                </p>
             </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
          {TEAM_STRUCTURE.map((group, index) => (
            <div key={index}>
                <Reveal width="100%">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-px bg-teal-200 dark:bg-teal-800 flex-grow"></div>
                        <h2 className="text-2xl md:text-3xl font-bold text-teal-800 dark:text-teal-400 text-center uppercase tracking-wide">
                            {group.category}
                        </h2>
                        <div className="h-px bg-teal-200 dark:bg-teal-800 flex-grow"></div>
                    </div>
                </Reveal>

                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center">
                    {group.members.map((member, mIndex) => (
                        <Reveal key={mIndex} delay={mIndex * 0.1} width="100%">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100 dark:border-gray-700 h-full flex flex-col items-center text-center p-6">
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 border-4 border-teal-50 dark:border-teal-900 shadow-inner bg-gray-200">
                                    <EditableImage 
                                        imageKey={`team_member_${member.id}`}
                                        src={member.image}
                                        alt={member.role}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                    {member.role}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    {group.category.split(' ')[0]} {/* Affiche le type court (ex: Administration) */}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Team;
