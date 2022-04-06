import {NextPage} from "next";
import style from './style.module.scss';
import LayoutDefault from "../../layout/layout.default";
import ServerSideProps from "../../side.props/server.side";
import {IQuery} from "../../dto/query";
import {IUser} from "../../dto/user";
import {IArticle} from "../../dto/news";
import News from "../../components/news";
import Chat from "../../components/chat";
import React from "react";

interface IArticlePage {
  query: IQuery,
  user: IUser,
  article: IArticle,
}

const Article: NextPage<IArticlePage> = ({query, user, article}) => {
  return (
    <LayoutDefault title={'Article'} query={query} user={user}>
      <section className={`${style.article}`}>
        <News article={article}/>
        <Chat article={article}/>
      </section>
    </LayoutDefault>
  )
}

export const getServerSideProps = ServerSideProps;

export default Article;