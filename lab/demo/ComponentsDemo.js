'use strict';

import React, {
  Component,
  PropTypes,
} from 'react';
import ReactNative, {
  StyleSheet,
  Platform,
  View,
  Text,
  ScrollView,
} from 'react-native';
import LAB, {
  requireComp,
} from 'lab4';
import SimplePage from 'lab4/demo/SimplePage';
import TestHelper from 'lab4/demo/TestHelper';
import ExampleBlock from './ExampleBlock';

const ActionTab = requireComp('com.ActionTab');
const ArticleContentBlock = requireComp('com.ArticleContentBlock');
const Badge = requireComp('com.Badge');
const CallButton = requireComp('com.CallButton');
const CallItem = requireComp('com.CallItem');
const CatCon = requireComp('com.CatCon');
const CenterAvatar = requireComp('com.CenterAvatar');
const CenterInput = requireComp('com.CenterInput');
const ConfirmButton = requireComp('com.ConfirmButton');
const Countdown = requireComp('com.Countdown');
const Counter = requireComp('com.Counter');
const Dropdown = requireComp('com.Dropdown');
const IconImageButton = requireComp('com.IconImageButton');
const IconImageText = requireComp('com.IconImageText');
const Label = requireComp('com.Label');
const ListFootnoteItem = requireComp('com.ListFootnoteItem');
const ListItem = requireComp('com.ListItem');
const ListItem1 = requireComp('com.ListItem1');
const ListMultiLineItem = requireComp('com.ListMultiLineItem');
const ListSimpleLineItem = requireComp('com.ListSimpleLineItem');
const ListTitleBar = requireComp('com.ListTitleBar');
const Loading = requireComp('com.Loading');
const MessageItemView = requireComp('com.MessageItemView');
const MessageSumView = requireComp('com.MessageSumView');
const PaginationBar = requireComp('com.PaginationBar');
const PersonalInformationItem = requireComp('com.PersonalInformationItem');
const Select = requireComp('com.Select');
const StarRate = requireComp('com.StarRate');
const TextInPicItem = requireComp('com.TextInPicItem');
const ThreeRowMulListItem = requireComp('com.ThreeRowMulListItem');
const ThreeRowSimListItem = requireComp('com.ThreeRowSimListItem');
const UserAvatar = requireComp('com.UserAvatar');
const BadgeItem = requireComp('com.BadgeItem');

const Line = requireComp('com.Line');
const Icon = requireComp('com.Icon');
const Image = requireComp('com.Image');


const EXAMPLES = [
  {
    title: 'com.ActionTab',
    render() {
      return (
        <ActionTab
          tabData={[{image: 'http://7xlydk.com1.z0.glb.clouddn.com/1486604606016', activeImage: 'http://7xlydk.com1.z0.glb.clouddn.com/1486604612493'}, {image: 'http://7xlydk.com1.z0.glb.clouddn.com/1486604606016', activeImage: 'http://7xlydk.com1.z0.glb.clouddn.com/1486604612493'}, {image: 'http://7xlydk.com1.z0.glb.clouddn.com/1486604606016', activeImage: 'http://7xlydk.com1.z0.glb.clouddn.com/1486604612493'}, {image: 'http://7xlydk.com1.z0.glb.clouddn.com/1486604606016', activeImage: 'http://7xlydk.com1.z0.glb.clouddn.com/1486604612493'}, {image: 'http://7xlydk.com1.z0.glb.clouddn.com/1486604606016', activeImage: 'http://7xlydk.com1.z0.glb.clouddn.com/1486604612493'}, {image: 'http://7xlydk.com1.z0.glb.clouddn.com/1486604606016', activeImage: 'http://7xlydk.com1.z0.glb.clouddn.com/1486604612493'}]}
          initialPage={0}
          multiple={1.4}
          style={{ height: 100, }}
        />
      );
    },
  },
  {
    title: 'com.ArticleContentBlock',
    render() {
      return (
        <ArticleContentBlock
          title="title"
          date="date"
          author="author"
          from="from"
          line={<Line />}
          content={<View style={{padding: 10}}><Text>content</Text></View>}
        />
      );
    },
  },
  {
    title: 'com.Badge',
    render() {
      return (
        <Badge
          text="10"
          icon="star-border"
        />
      );
    },
  },
  {
    title: 'com.BadgeItem',
    render() {
      return (
        <BadgeItem
          disabled={false}
          badgeText="11"
          badgeIcon="star-border"
        />
      );
    },
  },
  {
    title: 'com.CallItem',
    render() {
      return (
        <CallItem
          number="123456"
          text="拨打"
          icon="star-border"
        />
      );
    },
  },
  {
    title: 'com.CatCon',
    render() {
      return (
        <CatCon
          header={<View style={{padding: 5}}><Text>header</Text></View>}
        >
          <View style={{padding: 10}}>
            <Text>content</Text>
          </View>
        </CatCon>
      );
    },
  },
  {
    title: 'com.CenterAvatar',
    render() {
      return (
        <CenterAvatar/>
      );
    },
  },
  {
    title: 'com.CenterInput',
    render() {
      return (
        <CenterInput
          label="label"
          name="name"
          placeholder="placeholder"
          submitUrl="http://example.com"
        />
      );
    },
  },
  {
    title: 'com.ConfirmButton',
    render() {
      return (
        <ConfirmButton
          text="text"
          iconRight="star-border"
          message="message"
        />
      );
    },
  },
  {
    title: 'com.Countdown',
    render() {
      return (
        <Countdown
          initialTimeRemaining={9999999}
          interval={1000}
          completeCallback={() => { console.log('com.Countdown completeCallback'); }}
          description="description"
        />
      );
    },
  },
  {
    title: 'com.Counter',
    render() {
      return (
        <Counter
          id="xxx"
          editAble={true}
          maxCount={100}
          minCount={0}
          changeCount={1}
          defaultCount={10}
          onChange={(id, count) => { console.log('com.Counter onChange', id, count); }}
        />
      );
    },
  },
  {
    title: 'com.Dropdown',
    render() {
      return (
        <Dropdown
          type="left"
          text="text"
          icon="star-border"
          iconRight="star-border"
        />
      );
    },
  },
  {
    title: 'com.IconImageButton',
    render() {
      return (
        <IconImageButton
          iconName="star-border"
          iconSize={20}
          text="text"
          textPosition="top"
        />
      );
    },
  },
  {
    title: 'com.IconImageText',
    render() {
      return (
        <IconImageText
          iconName="star-border"
          iconSize={20}
          text="text"
          textPosition="top"
        />
      );
    },
  },
  {
    title: 'com.Label',
    render() {
      return (
        <Label
          text="text"
        />
      );
    },
  },
  {
    title: 'com.ListFootnoteItem',
    render() {
      return (
        <ListFootnoteItem
          date="date"
        />
      );
    },
  },
  {
    title: 'com.ListItem',
    render() {
      return (
        <ListItem
          title="title"
        />
      );
    },
  },
  {
    title: 'com.ListItem1',
    render() {
      return (
        <ListItem1
          icon={<Icon name="star-border"/>}
          title="title"
          desc="desc"
        />
      );
    },
  },
  {
    title: 'com.ListMultiLineItem',
    render() {
      return (
        <ListMultiLineItem
          image={{ui_type: 'com.Image', uri: 'http://7xlydk.com1.z0.glb.clouddn.com/1486604606016'}}
          title="title"
          textRight="textRight"
          lineOfTitle={1}
          describe="describe"
          lineOfDesc={2}
          footText="footText"
          footnote={<View><Text>footnote</Text></View>}
        />
      );
    },
  },
  {
    title: 'com.ListSimpleLineItem',
    render() {
      return (
        <ListSimpleLineItem
          image="http://7xlydk.com1.z0.glb.clouddn.com/1486604606016"
          textLeft="textLeft"
          textRight="textRight"
          lineOfText={2}
          iconRight="star-border"
        />
      );
    },
  },
  {
    title: 'com.ListTitleBar',
    render() {
      return (
        <ListTitleBar
          icon="star-border"
          textLeft="textLeft"
          textRight="textRight"
          lineOfText={1}
          iconRight="star-border"
          line={<Line/>}
        />
      );
    },
  },
  {
    title: 'com.Loading',
    render() {
      return (
        <Loading
          message="message"
        />
      );
    },
  },
  {
    title: 'com.MessageItemView',
    render() {
      return (
        <MessageItemView
         flag={true}
         badge={<Badge/>}
        >
          <View style={{padding: 10}}><Text>content</Text></View>
        </MessageItemView>
      );
    },
  },
  {
    title: 'com.MessageSumView',
    render() {
      return (
        <MessageSumView
          type="system"
          showNumber={true}
        />
      );
    },
  },
  {
    title: 'com.PaginationBar',
    render() {
      return (
        <PaginationBar
          activeTab={1}
          length={5}
        />
      );
    },
  },
  {
    title: 'com.PersonalInformationItem',
    render() {
      return (
        <PersonalInformationItem
          image={<Image uri="http://7xlydk.com1.z0.glb.clouddn.com/1486604606016"/>}
          name="name"
          integral={10}
          isVip={true}
        />
      );
    },
  },
  {
    title: 'com.Select',
    render() {
      return (
        <Select
          disabled={false}
          label="label"
          defaultText="defaultText"
          data={[{value: 1}, {value: 2}, {value: 3}]}
        />
      );
    },
  },
  {
    title: 'com.StarRate',
    render() {
      return (
        <StarRate
        />
      );
    },
  },
  {
    title: 'com.TextInPicItem',
    render() {
      return (
        <TextInPicItem
          image={<Image uri="http://7xlydk.com1.z0.glb.clouddn.com/1486604606016"/>}
          title="title"
        />
      );
    },
  },
  {
    title: 'com.ThreeRowMulListItem',
    render() {
      return (
        <ThreeRowMulListItem
          image={<Image uri="http://7xlydk.com1.z0.glb.clouddn.com/1486604606016" />}
          titleCenter="titleCenter"
          lineOfTitle={1}
          titleRightText="titleRightText"
          descCenterText="descCenterText"
          footCenterText="footCenterText"
          textRight="textRight"
          iconRight="star-border"
        />
      );
    },
  },
  {
    title: 'com.ThreeRowSimListItem',
    render() {
      return (
        <ThreeRowSimListItem
          icon="star-border"
          titleCenter="titleCenter"
          lineOfTitle={1}
          textRight="textRight"
          iconRight="star-border"
        />
      );
    },
  },
  {
    title: 'com.UserAvatar',
    render() {
      return (
        <UserAvatar
          titleCenter="titleCenter"
          iconRight="star-border"
        />
      );
    },
  },
];

/**
 * 一些简单组件的demo集合
 */
export default class ComponentsDemo extends SimplePage {

  constructor(props, context) {
    super(props, context);
    this.state = {
    };
    this.configPage({
      scrollable: true,
    });
  }

  renderTest() {
    return (
      <View style={styles.container}>
        {EXAMPLES.map((example, i) => {
          return (
            <ExampleBlock
              key={i}
              title={example.title}
            >
              {example.render()}
            </ExampleBlock>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  exampleBlock: {
    marginBottom: 16,
  },
  exampleTitle: {
    fontSize: 14,
    padding: 5,
  },
});
