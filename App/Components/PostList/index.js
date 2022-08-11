/** @format */

import React, { PureComponent } from 'react'
import { FlatList, TouchableOpacity, Text, Animated, View } from 'react-native'
import { Constants, Tools, Languages, Images } from '@common'
import { fetchPostRecent } from '@redux/actions'
import { connect } from 'react-redux'
import { PostLayout, AnimatedHeader } from '@components'
import styles from './styles';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

class PostList extends PureComponent {
  state = { scrollY: new Animated.Value(0) }

  constructor(props) {
    super(props)
    this.page = 1
    this.defaultList = [
      {
        id: 1,
        name: Languages.loading,
        title: { render: 'Loading' },
        images: [Images.imageHolder],
      },
      {
        id: 2,
        name: Languages.loading,
        title: { render: 'Loading' },
        images: [Images.imageHolder],
      },
      {
        id: 3,
        name: Languages.loading,
        title: { render: 'Loading' },
        images: [Images.imageHolder],
      },
    ]
  }

  componentDidMount() {
    this.fetchPost()
  }

  onViewPost = (item, index) =>
    this.props.onViewPost(item, index, this.props.index)

  fetchPost = (reload = false) => {
    if (reload) {
      this.page = 1
    }

    this.props.fetchPostRecent(this.page)
  }

  nextPosts = () => {
    this.page += 1
    this.fetchPost()
  }

  renderItem = ({ item, index }) => {
    const { layout } = this.props
    const isFlexibleColumn = [Constants.Layout.threeColumn, Constants.Layout.column, Constants.Layout.flexColumn].includes(layout);
      // layout === Constants.Layout.threeColumn ||
      // layout === Constants.Layout.column ||
      // layout === Constants.Layout.flexColumn

    const newLayout = isFlexibleColumn
      ? Constants.Layout.twoColumn
      : Number(layout)

    return (
      <View style={styles.rowItem}>
        <PostLayout
          post={item}
          key={`post-${index}`}
          onViewPost={() => this.onViewPost(item, index)}
          layout={newLayout}
        />
      </View>
    )
  }
  renderAnimatedHeader = () => {
    const { goBack, headerLabel } = this.props

    if (typeof headerLabel !== 'undefined') {
      return (
        <TouchableOpacity activeOpacity={0.9} style={styles.header}>
          <Text style={[styles.headerText]}>
            {Tools.formatText(headerLabel)}
          </Text>
        </TouchableOpacity>
      )
    }
    return <AnimatedHeader goBack={goBack} scrollY={this.state.scrollY} />
  }

  render() {
    const { showHeader, layout, horizontal, list } = this.props;

    if (typeof list === 'undefined' || list.length === 0) return <View />

    return (
      <View style={styles.flatWrap}>
        {showHeader && this.renderAnimatedHeader()}

        <AnimatedFlatList
          contentContainerStyle={showHeader && styles.vList}
          data={list}
          keyExtractor={(item, index) => `${index}`}
          renderItem={this.renderItem}
          numColumns={layout === Constants.Layout.twoColumn ? 2 : 1}
          onEndReached={!horizontal && this.nextPosts}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true }
          )}
        />
      </View>
    )
  }
}

/** @format */

const mapStateToProps = ({ posts, config }, ownProps) => {
  return {
    list: posts.list,
    layout: ownProps.layout ? ownProps.layout : config.verticalLayout,
  }
}

export default connect(
  mapStateToProps,
  { fetchPostRecent }
)(PostList)
