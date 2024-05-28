import styled from "styled-components"

export const Profile = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 1024px;
  justify-content: center;
  align-items: center;
  font-family: "Noto Sans";
`

export const ProfileHeader = styled.div`
  display: flex;
  width: 80%;
  margin-bottom: 2rem;
`
export const ProfileInformation = styled.div`
  width: 1024px;
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`
export const ProfileTitle = styled.div`
  display: flex;
  align-items: end;
  width: 100%;
  font-size: 1.5rem;
`
export const ProfileText = styled.div`
  font-weight: bold;
`

export const RegisterDate = styled.div`
  color: var(--chakra-colors-textColor);
  font-weight: 600;
  margin-left: 0.1rem;
  margin-bottom: 0.1rem;
  font-size: 0.7rem;
`
export const ReviewNumber = styled.div`
  & + & {
    margin-left: 10px;
  }
  margin-left: 5px;
  margin-top: 5px;
  font-size: 0.7rem;
  font-weight: bold;
`

export const UploadImageButton = styled.button`
  margin-top: 0.5rem;
  width: 3rem;
  font-size: 0.5rem;
  border: 1px solid lavender;
  border-radius: 0.2rem;
`

export const ProfileContentWrapper = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

export const ProfileContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  width: 100%;
  margin-top: 1rem;
  border-radius: 1rem;
  padding: 0.5rem 0 0.5rem 1rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`

export const NicknameEditButton = styled.button``
export const ChangePasswordButton = styled.button`
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 5rem;
  transform: translate(-10%, 25%);
  border-radius: 3px;
  font-size: 0.7rem;
`
export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  width: 90%;
  font-size: 0.9;
  font-weight: bold;
`

export const ContentBody = styled.div`
  width: 100%;
  display: flex;
  font-size: 0.8rem;
`

export const WithdrawWrap = styled.div`
  color: red;
  padding: 1rem;
  background-color: #fff0f0;
  border-radius: 0.5rem;
  margin-top: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: auto;
`

export const WithdrawButton = styled.button`
  color: red;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darkred;
  }
`
