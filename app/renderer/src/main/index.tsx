import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Space, Table, Upload, Notification, Alert } from '@arco-design/web-react';
import * as XLSX from 'xlsx';
import StatisticsModal from '@/main/StatisticsModal';
import dayjs from 'dayjs';
import HighLevelModal from '@/main/HighLevelModal';

const FormItem = Form.Item;

const format: string = "YYYY-MM-DD HH:mm:ss";



interface Page  {
  page_size: number,
  page_number: number,
}

const level = [
  {
    label: 'A类（重点照护类）',
    value: 'A类（重点照护类）'
  },
  {
    label: 'B类（康养自理类）',
    value: 'B类（康养自理类）'
  },
  {
    label: 'C类（健康活力类）',
    value: 'C类（健康活力类）'
  }
]

const Main = () => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [rating, setRating] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<Page>({ page_number: 1, page_size: 10 });
  const [highLevelModalVisible, setHighLevelModalVisible] = useState<boolean>(false);
  const [highNum, setHighNum] = useState<number>(0);


  const [form] = Form.useForm()
  const getData = async (queryData: any) => {
    setLoading(true);
    const res = await window.ipc.getData(queryData);
    if (res) {
      setTotal(res.total);
      setData(res.data);
    }else {
      setTotal(0)
      setData([]);
    }
    setLoading(false);
  };

  const getAData = async () => {
    const res = await window.ipc.getData({ level: 'A类（重点照护类）', page_size: 10, page_number: 1 });
    if (res) {
      setHighNum(res.total);
      setHighLevelModalVisible(true)
    }
  }

  const handleLevel = (level: string) => {
    if (level === 'A类（重点照护类）') {
      return <span style={{color: 'red'}}>{level}</span>
    }else if (level === 'B类（康养自理类）') {
      return <span style={{color: 'orange'}}>{level}</span>
    }else if (level === 'C类（健康活力类）') {
      return <span style={{color: 'green'}}>{level}</span>
    }
  }

  const columns = [
    {
     title: '序号',
     dataIndex: 'customer_id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '评级',
      dataIndex: 'level',
      render: (level: string) => handleLevel(level)
    },
    {
      title: '上传时间',
      dataIndex: 'created_at',
      render: (col: number) =>  dayjs(col).format(format)
    },
  ]

  const handlePageChange = (pageNumber: number, pageSize: number) => {
    const formData = form.getFieldsValue();
      const queryData = {...formData, page_size: pageSize, page_number: pageNumber };
      getData(queryData);
    setPage({page_number: pageNumber, page_size: pageSize});
  };

  useEffect(() => {
    getData({ page_size: 10, page_number: 1 });
  }, [])

  useEffect(() => {
    getAData();
  }, [])

  const handleFormChange = () => {
    const formData = form.getFieldsValue();
    if (formData) {
      const queryData = {...formData, ...page}
      getData(queryData);
    }
  }

  const handleUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload =  async  (e) => {
      const workbook = XLSX.read(e?.target?.result, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      const ratingCount = data.reduce((acc, item) => {
        // @ts-ignore
        if (!acc[item.评级]) {
          // @ts-ignore
          acc[item.评级] = 0;
        }
        // @ts-ignore
        acc[item.评级]++;
        return acc;
      }, {});
      const statics =ratingCount && Object.entries(ratingCount).map(([key, value]) => ({
        label: key,
        value: value
      }));
      setRating(statics);
      setVisible(true);
      const res = await window.ipc.saveData(data)
      if (res) {
        Notification.success({content: "数据保存成功"})
        getData({ page_size: 10, page_number: 1 });
      } else {
        Notification.error({content: "数据保存失败, 请重新导入"})
      }
    };

    reader.readAsBinaryString(file);
    return false
  }
  return (<Wrapper>
    <Header>
      <Form form={form} onChange={() => handleFormChange()} >
        <Space>
          <FormItem field="name" noStyle>
            <Input prefix="名字查询"/>
          </FormItem>
          <FormItem field='level' noStyle>
            <Select style={{width: 300}} prefix="等级" options={level} allowClear/>
          </FormItem>
        </Space>
      </Form>
      <Space>
        <Upload
          beforeUpload={handleUpload}
        >
          <Button type="primary">导入表格</Button>
        </Upload>
      </Space>
    </Header>
    <Body>
      <Table rowKey="id" columns={columns} data={data} loading={loading} pagination={{showTotal: true, total: total,  pageSize: page.page_size,
        current: page.page_number,
        onChange: handlePageChange}}/>
    </Body>
    <StatisticsModal visible={visible} onCancel={() => setVisible(false)} data={rating} onSubmit={() => setVisible(false)}/>
    <HighLevelModal visible={highLevelModalVisible} onCancel={() =>setHighLevelModalVisible(false)} data={highNum} onSubmit={() => setHighLevelModalVisible(false)}/>
  </Wrapper>)
}


const Wrapper = styled.div`
    margin: 16px
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Body = styled.div`
    margin-top: 16px;
`
export default Main;
