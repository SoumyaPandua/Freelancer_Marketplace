import { CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

function ProjectCard({ title, description, budget, deadline, skills }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <CurrencyDollarIcon className="w-5 h-5" />
          <span>{budget}</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarIcon className="w-5 h-5" />
          <span>{deadline}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ProjectCard;