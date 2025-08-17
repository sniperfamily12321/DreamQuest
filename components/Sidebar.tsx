
import React from 'react';
import { Item, Relationship, TranslatedUI } from '../types';
import Icon from './Icon';

interface SidebarProps {
  inventory: Item[];
  relationships: Relationship[];
  location: string;
  unlockedAchievements: number;
  totalAchievements: number;
  points: number;
  uiText: TranslatedUI;
}

const SidebarSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-slate-800/70 backdrop-blur-sm p-4 rounded-lg border border-slate-700 mb-6">
        <h3 className="text-lg font-orbitron text-teal-400 mb-3 flex items-center gap-2">
            {icon}
            <span>{title}</span>
        </h3>
        <div className="space-y-2 text-slate-300">{children}</div>
    </div>
);


const Sidebar: React.FC<SidebarProps> = ({ inventory, relationships, location, unlockedAchievements, totalAchievements, points, uiText }) => {
  return (
    <aside>
      <SidebarSection title={uiText.map} icon={<Icon name="map" className="w-5 h-5"/>}>
        <p className="font-bold text-white">{location}</p>
      </SidebarSection>
      
      <SidebarSection title={uiText.inventory} icon={<Icon name="inventory" className="w-5 h-5"/>}>
        {inventory.length > 0 ? (
            inventory.map(item => (
                <div key={item.name} title={item.description} className="cursor-help">
                    <p>{item.name}</p>
                </div>
            ))
        ) : (
            <p className="text-slate-500 italic">Empty</p>
        )}
      </SidebarSection>

      <SidebarSection title={uiText.relationships} icon={<Icon name="users" className="w-5 h-5"/>}>
        {relationships.length > 0 ? (
            relationships.map(rel => (
                <div key={rel.name}>
                    <p>{rel.name}: <span className="font-semibold">{rel.score}</span></p>
                </div>
            ))
        ) : (
            <p className="text-slate-500 italic">No one yet</p>
        )}
      </SidebarSection>
       <SidebarSection title={uiText.achievements} icon={<Icon name="trophy" className="w-5 h-5"/>}>
        <p>{unlockedAchievements} / {totalAchievements} Unlocked</p>
      </SidebarSection>
      <SidebarSection title={uiText.points} icon={<Icon name="trophy" className="w-5 h-5"/>}>
        <p className="font-bold text-yellow-400 text-lg">{points}</p>
      </SidebarSection>
    </aside>
  );
};

export default Sidebar;
