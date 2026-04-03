import { FixedSizeList as List } from 'react-window';
import ClipCard from './ClipCard';
import type { Clip } from '../types';

interface ClipListProps {
  clips: Clip[];
  onDeleteRequest: (clip: Clip) => void;
}

const ITEM_HEIGHT = 120;

export default function ClipList({ clips, onDeleteRequest }: ClipListProps) {
  if (clips.length === 0) {
    return null;
  }

  return (
    <List
      height={600}
      itemCount={clips.length}
      itemSize={ITEM_HEIGHT}
      width="100%"
      className="clip-list"
      style={{ paddingRight: '2px' }}
    >
      {({ index, style }) => (
        <div style={{ ...style, paddingRight: '2px' }}>
          <ClipCard 
            clip={clips[index]} 
            onDeleteRequest={onDeleteRequest}
          />
        </div>
      )}
    </List>
  );
}
