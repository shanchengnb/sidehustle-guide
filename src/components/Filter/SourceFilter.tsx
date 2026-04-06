import type { DataSource, SOURCE_LABELS } from '../../types';
import { SOURCE_LABELS as LABELS, SOURCE_COLORS } from '../../types';

interface SourceFilterProps {
  selected: DataSource[];
  onChange: (sources: DataSource[]) => void;
}

const ALL_SOURCES: DataSource[] = ['reddit', 'hackernews', 'producthunt', 'futuretools'];

export function SourceFilter({ selected, onChange }: SourceFilterProps) {
  const toggleSource = (source: DataSource) => {
    if (selected.includes(source)) {
      onChange(selected.filter(s => s !== source));
    } else {
      onChange([...selected, source]);
    }
  };

  const selectAll = () => {
    onChange([]);
  };

  const isAllSelected = selected.length === 0;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm text-gray-500 mr-2">数据来源：</span>

      <button
        onClick={selectAll}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isAllSelected
          ? 'bg-gray-800 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
      >
        全部
      </button>

      {ALL_SOURCES.map(source => {
        const isSelected = selected.includes(source);
        return (
          <button
            key={source}
            onClick={() => toggleSource(source)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isSelected
              ? SOURCE_COLORS[source]
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
          >
            {LABELS[source]}
          </button>
        );
      })}
    </div>
  );
}
