import React from "react";
import { connect } from "react-redux";

import { fetchPosts, updatePostPage } from "../state/posts";
import FontIcon from "material-ui/FontIcon";
import RaisedButton from "material-ui/RaisedButton";

class Posts extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchPosts(1));
  }
  render() {
    var posts = this.props.Posts.get("posts").map(p => {
      return <li><a href={p.get("perma_link")}>{p.get("title")}</a></li>;
    });
    return (
      <div style={{ padding: "20px" }}>
        <h1>
          Posts (page {this.props.Posts.get("page")})
          {this.props.Posts.get("is_loading")
            ? <FontIcon className="fa fa-spinner fa-spin fa-2x fa-fw" />
            : null}
        </h1>
        {posts}
        <RaisedButton
          label="Prev"
          disabled={this.props.Posts.get("page") < 2}
          primary
          icon={<FontIcon className="fa fa-caret-left" />}
          onClick={() => {
            this.props.dispatch(updatePostPage(-1));
            this.props.dispatch(fetchPosts());
          }}
        />

        <RaisedButton
          label="Next"
          primary
          icon={<FontIcon className="fa fa-caret-right" />}
          onClick={() => {
            this.props.dispatch(updatePostPage(1));
            this.props.dispatch(fetchPosts());
          }}
        />

      </div>
    );
  }
}
export default connect(state => state)(Posts);
