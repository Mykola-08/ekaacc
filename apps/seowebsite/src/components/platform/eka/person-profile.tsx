import React from 'react';

export default function PersonProfile(props: any) {
  return <div>Person Profile: {props.person?.id || props.userId}</div>;
}