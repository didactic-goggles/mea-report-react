import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllJobs } from '../../../store/reducers/upload';
import { Card, ProgressBar } from 'react-bootstrap';
const Queues = () => {
  console.log('Rendering => Queues');
  const jobs = useSelector(selectAllJobs);
  console.log(jobs);
  const Job = (job) => {
    // const fileType =
    //   job.fileType == 'orders'
    //     ? 'Sipariş'
    //     : job.fileType == 'payments'
    //     ? 'Ödeme'
    //     : job.fileType == 'users'
    //     ? 'Kullanıcı'
    //     : job.fileType == 'services'
    //     ? 'Servis'
    //     : 'Tanımsız';
    return (
      <Card key={job.id} style={{boxShadow: 'unset'}}>
        <Card.Body>
          <div className="d-flex flex-column">
            <h5>{job.name}</h5>
            <small>{job.fileTypeTR}</small>
          </div>
          <ProgressBar
            variant={
              job.completedThreadSize === job.threadSize ? 'success' : 'primary'
            }
            now={(job.completedThreadSize / job.threadSize) * 100}
            label={`${job.completedThreadSize} / ${job.threadSize}`}
          />
        </Card.Body>
      </Card>
    );
  };
  return (
    <div
      className="d-flex justify-content-center flex-column"
      style={{
        minWidth: '20rem',
      }}
    >
      {jobs.length > 0 ? (
        jobs.map((job) => Job(job))
      ) : (
        <div className="text-center">
          <h4>Bekleyen bir işlem yok</h4>
          <small>
            Dosya Yükle bölümünde yüklediğiniz dosyalar burada görünür
          </small>
        </div>
      )}
    </div>
  );
};

export default Queues;
