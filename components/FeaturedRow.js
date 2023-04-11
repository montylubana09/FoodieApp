import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from "react-native-heroicons/outline";
import RestrauntCard from "./RestrauntCard";
import sanityClient from "../sanity";
const FeaturedRow = ({ id, title, description }) => {
  const [restraunts, setRestraunts] = useState([]);
  useEffect(() => {
    sanityClient
      .fetch(
        `
        *[_type=='featured' && _id== $id]
        {
          ...,
          restraunts[]->{
            ...,
            dishes[]->,
            type->{
              name
            }
          },
        }[0]

        
        `,
        { id }
      )
      .then((data) => {
        if (data) {
          setRestraunts(data?.restraunts);
        } else {
          console.log("No data found");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);
  // console.log(restraunts);
  return (
    <View>
      <View className="mt-4 flex-row items-center justify-between px-4">
        <Text className="font-bold text-lg">{title}</Text>
        <ArrowRightIcon />
      </View>
      <Text className="text-sm text-gray-500 px-4">{description}</Text>
      <ScrollView
        horizontal
        contentContainerStyle={{
          paddingHorizontal: 15,
        }}
        showsHorizontalScrollIndicator={false}
        className="pt-4"
      >
        {/* RestrauntCards.. */}
        {restraunts?.map((restraunt) => (
          <RestrauntCard
            key={restraunt._id}
            id={restraunt.id}
            imgUrl={restraunt.image}
            title={restraunt.name}
            rating={restraunt.rating}
            genre={restraunt.type?.name}
            address={restraunt.address}
            short_description={restraunt.short_description}
            dishes={restraunt.dishes}
            long={restraunt.long}
            lat={restraunt.lat}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default FeaturedRow;
