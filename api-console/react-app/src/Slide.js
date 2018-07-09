import React from 'react';
import { Menu } from 'antd';

import apis from './apis-config.json';

const SubMenu = Menu.SubMenu;

class Sider extends React.Component {
  render() {
    const menus = apis.menus;
    const openKeys = menus.map(item => item.title);
    const arr = menus.map(({ title, apis }, index0) => {
      return (
        <SubMenu
          key={title}
          title={
            <span>
              <span>{title}</span>
            </span>
          }
        >
          {apis.map((item, index) => (
            <Menu.Item key={index0 + '_' + index}>{item.title}</Menu.Item>
          ))}
        </SubMenu>
      );
    });

    return (
      <Menu
        onClick={this.props.choseApi}
        defaultSelectedKeys={[this.props.current]}
        defaultOpenKeys={openKeys}
        mode="inline"
      >
        {arr}
      </Menu>
    );
  }
}

export default Sider;
