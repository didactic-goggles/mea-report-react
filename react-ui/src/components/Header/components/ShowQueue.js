import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllJobs } from '../../../store/reducers/upload';
import { Dropdown, Button, Badge } from 'rsuite';
import { AiOutlineCloudUpload } from 'react-icons/ai';

import Queues from './Queues';

const ShowQueue = () => {
  console.log('Rendering => ShowQueue');
  const jobs = useSelector(selectAllJobs);
  if (jobs.length < 1) {
    return null;
  }
  return (
    <div>
      <Dropdown
        placement="bottomEnd"
        // trigger={['click', 'hover']}
        renderTitle={() => {
          return (
            <Badge
              content={jobs.length}
            >
              <Button appearance="subtle" circle style={{padding: 0}}>
                <AiOutlineCloudUpload size="30" />
              </Button>
            </Badge>
          );
        }}
      >
        <Queues />
      </Dropdown>
    </div>
  );
};

export default ShowQueue;
