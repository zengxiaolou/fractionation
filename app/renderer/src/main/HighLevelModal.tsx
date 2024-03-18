import {  Modal, ModalProps } from '@arco-design/web-react';
import React, { FC } from 'react';

interface Props extends ModalProps {
  visible: boolean;
  onCancel: () => void;
  data: any
  onSubmit: () => void
}


const HighLevelModal: FC<Props> = ({visible, onCancel, data, onSubmit}) => {

  return <Modal title="A类成员通知" visible={visible} onCancel={onCancel} style={{width: 300}} maskClosable={false} onConfirm={onSubmit}>
    A类人员有{data}人，请及时关注
  </Modal>

}

export default HighLevelModal
