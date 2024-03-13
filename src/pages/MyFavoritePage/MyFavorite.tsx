import SideBar from "@/components/sidebar/SideBar"
import { CiStar } from "react-icons/ci"
import { MyPageWrapper } from "@/styles/styles"
import { Favorite, FavoriteList, FavoriteTitle, ListBox, ViewAllButton } from "@/pages/MyFavoritePage/MyFavoriteStyle"
import CardItem from "@/components/card/CardItem"

const MyFavorite = () => {
  return (
    <MyPageWrapper>
      <SideBar />
      <Favorite>
        <FavoriteTitle>
          <CiStar size="2rem" />
          일정 즐겨찾기 목록
        </FavoriteTitle>
        <FavoriteList>
          <ListBox>
            <CardItem />
            <CardItem />
            <CardItem />
          </ListBox>
          <ListBox>
            <CardItem />
            <CardItem />
            <CardItem />
          </ListBox>
        </FavoriteList>
        <ViewAllButton>VIEW ALL</ViewAllButton>
      </Favorite>
    </MyPageWrapper>
  )
}

export default MyFavorite
