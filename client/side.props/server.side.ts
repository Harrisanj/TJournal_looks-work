import {wrapper} from "../redux/store";
import {getCookies} from "cookies-next";
import { RequestServer } from "../helpers/request.server";
import {GetServerSideProps} from "next";
import {IUser} from "../dto/user";

const homeRedirect = () => { return { redirect: { permanent: false, destination: "/home" } } } ;

const ServerSideProps: GetServerSideProps = wrapper.getServerSideProps(store => async ({resolvedUrl, params, query, req}) => {
  const data = {} as { query: boolean, user: IUser };
  const regist = query.registration;
  const token = getCookies({req}).token;
  const page = resolvedUrl.split('/')[1];
  const request = token ? RequestServer(token, store.dispatch) : false;

  if(!store.getState().user.id && request) {
    await request.Profile();
  }

  if(/article/.test(page) && params && request) {
    await request.Article(String(params.id));
  }

  if(/home/.test(page) && request) {
    await request.AllArticle(0, query.nav ? String(query.nav) : 'all');
    await request.ShortArticle(0);
  }

  data.query = regist === 'true' ? Boolean(regist) : false;
  // if(!profile.id) return { redirect: { permanent: false, destination: "/setting" } };

  return { props: { ...data } };
});

export default ServerSideProps;