import React from 'react';
import {Link} from 'react-router';
import {
    Form,
    Row,
    Col,
    Breadcrumb,
    Icon,
    Divider,
    Button,
    Badge,
    Dropdown,
    Menu,
    notification,
    Collapse,
    Card,
    Table,
    Spin
} from 'antd';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import {message, Modal} from "antd/lib/index";

const Panel = Collapse.Panel;

const queryListUrl = restUrl.ADDR + 'ad/queryList';
const reviewUrl = restUrl.ADDR + 'ad/review';
const delLiveUrl = restUrl.ADDR + 'ad/delete';

const formItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 12},
};

class Ad extends React.Component {
    constructor(props) {
        super(props);

        this.columns = [{
            title: '动态标题',
            dataIndex: 'adTitle',
            key: 'adTitle',
            render: (text, record, index) => (
                <Link to={this.editrouter(record.id)}>{text}</Link>
            )
        }, {
            title: '链接',
            dataIndex: 'adLink',
            key: 'adLink',
        }, {
            title: '审核状态',
            dataIndex: 'state',
            key: 'state',
            width: 120,
            style: {textAlign: 'left'},
            render: (text, record, index) => {
                if (text === 0) {
                    return (
                        <span><Badge status="warning"/>待审核</span>
                    );
                } else if (text === 1) {
                    return (
                        <span><Badge status="success"/>审核通过</span>
                    );
                } else if (text === -1) {
                    return (
                        <span><Badge status="success"/>不合格</span>
                    );
                }
            }
        }, {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        }, {
            title: <a><Icon type="setting" style={{fontSize: 18}}/></a>,
            key: 'operation',
            fixed: 'right',
            width: 120,
            align: 'center',
            render: (text, record, index) => (
                <div>
                    <a onClick={() => this.onReview(record.id)}>审核</a>
                    <Divider type="vertical"/>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item>
                                    <Link to={this.editrouter(record.id)}>编辑</Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <a onClick={() => this.onDelete(record.id)}>删除</a>
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <a className="ant-dropdown-link">操作</a>
                    </Dropdown>
                </div>
            ),
        }];

        this.state = {
            loading: false,
            dataSource: []
        };
    }

    componentDidMount = () => {
        this.queryList();
    }

    //获取失物招领详情
    queryList = (id) => {
        let param = {};
        param.id = id;
        ajax.getJSON(queryListUrl, param, (data) => {
            if(data.success){
                const backData = data.backData;
                backData.map(item => item.key = item.id);
                this.setState({
                    dataSource: backData,
                    loading: false
                });
            }
            else {

            }
        });
    }

    detailrouter = (id) => {
        return `/frame/dish/dishDetailInfo/${id}`
    }

    editrouter = (id) => {
        return `/frame/ad/editAd/${id}`
    }

    onReview = id => {
        Modal.confirm({
            title: '提示',
            content: '确认审核通过吗',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                let param = {};
                param.id = id;
                ajax.postJSON(reviewUrl, JSON.stringify(param), data => {
                    if (data.success) {
                        notification.open({
                            message: '审核成功！',
                            icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>,
                        });
                        this.getList();
                        this.forceUpdate();
                    } else {
                        message.warning(data.backMsg);
                    }
                });
            }
        });
    }

    onDelete = (key) => {
        Modal.confirm({
            title: '提示',
            content: '确认要删除吗？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                let param = {};
                param.id = key;
                ajax.postJSON(delLiveUrl, JSON.stringify(param), data => {
                    if (data.success) {
                        notification.open({
                            message: '删除成功！',
                            icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>,
                        });
                        this.getList();
                        this.forceUpdate();
                    } else {
                        message.warning(data.backMsg);
                    }
                });
            }
        });
    }

    render() {
        let {
            dataSource,
            loading,
        } = this.state;

        return (
            <div className="zui-content">
                <div className='pageHeader'>
                    <div className="breadcrumb-block">
                        <Breadcrumb>
                            <Breadcrumb.Item>首页</Breadcrumb.Item>
                            <Breadcrumb.Item>平台概况</Breadcrumb.Item>
                            <Breadcrumb.Item>广告平台</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <h1 className='title'>广告管理</h1>
                </div>
                <div className='pageContent'>
                    <Row gutter={24}>
                        <Col span={18}>
                            <Card title='广告列表' loading={loading}>
                                <Table
                                    bordered={true}
                                    dataSource={dataSource}
                                    columns={this.columns}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card title='点击量'>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}
Ad.contextTypes = {
    router: React.PropTypes.object
}

export default Ad;
