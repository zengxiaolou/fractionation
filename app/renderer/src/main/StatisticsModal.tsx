import { Descriptions, Modal, ModalProps } from '@arco-design/web-react';
import React, { FC } from 'react';

interface Props extends ModalProps {
  visible: boolean;
  onCancel: () => void;
  data: any
  onSubmit: () => void
}


const StatisticsModal: FC<Props> = ({visible, onCancel, data, onSubmit}) => {

  return <Modal title="本次上传统计结果" visible={visible} onCancel={onCancel} style={{width: 300}} maskClosable={false} onConfirm={onSubmit}>
    <Descriptions column={1}  data={data} />
  </Modal>

}

export default StatisticsModal
