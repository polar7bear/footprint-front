import React from "react"
import { Avatar, Badge, Box, Card, CardBody, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react"
import { ImageContainer, PositionedAvatar } from "@/components/card/ReviewCardItem.style"
import { ReviewCardItemProps } from "@/components/card/type"

const ReviewCardItem: React.FC<ReviewCardItemProps> = ({
  title,
  memberId,
  nickname,
  likes,
  createdAt,
  previewImage
}) => {
  const formattedDate = createdAt
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
    .replace(/\. /g, "-")
    .replace(".", "")
  return (
    <>
      <Card maxW="xs" marginLeft="10px">
        <CardBody pb="10px">
          <Box display="flex" justifyContent="center">
            <ImageContainer>
              <Image
                src={
                  previewImage
                    ? previewImage
                    : "https://images.unsplash.com/photo-1676705909846-2d6183d8bc1e?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                alt="강원도 산 사진"
                borderRadius="lg"
                width={"330px"}
                height={"160px"}
              />
              <PositionedAvatar>
                <Avatar border="2px solid white" size="md" name={nickname} />
              </PositionedAvatar>
            </ImageContainer>
          </Box>
          <Stack mt="3" spacing="3">
            <Box display="flex" justifyContent="space-between" mt="-79">
              <Flex alignItems="center">
                <Badge borderRadius="2px" colorScheme="green" minWidth="50px">
                  2박 3일
                </Badge>
                <Text color="gray.500" fontSize="9px" ml="1" mt="-2" mb="-2">
                  2024.03.05 ~ 2024.03.07
                </Text>
              </Flex>

              <Flex alignItems={"center"} color="red" fontSize="14px" userSelect={"none"} marginRight="5px">
                ♥{" "}
                <Text color="black" fontSize="10px" display="inline-block">
                  {likes}
                </Text>
              </Flex>
            </Box>

            <Heading size="sm">{title}</Heading>
            <Box textAlign="right">
              <Text color="gray.500" fontSize="9px">
                작성일자 : {formattedDate}
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </>
  )
}

export default ReviewCardItem
