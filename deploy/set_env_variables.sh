#!/bin/zsh

echo NEXT_PUBLIC_BASE_DOMAIN=narpha.click >> next/.env &&
echo NEXTAUTH_SECRET=WOulwfD+sg7zKpIEBrJhVXLyRrKk5z2J9pz72b5K1zQ= >> next/.env &&
echo NEXTAUTH_JWT_SECRET=QWUNsTwbrff8rW+rdwlXH3919bxEj9rN6zSLzcg0GfE= >> next/.env &&
echo NEXT_PUBLIC_API_ENDOPOINT=https://api.narpha.click/ >> next/.env &&
echo API_ENDOPOINT=https://api.narpha.click/ >> next/.env &&
echo NEXTAUTH_URL=https://app.narpha.click >> next/.env &&

echo AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID >> next/.env &&
echo AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY >> next/.env &&
echo AWS_BUCKET=$AWS_BUCKET >> next/.env &&

echo OKTA_CLIENT_ID=$OKTA_CLIENT_ID >> next/.env &&
echo OKTA_CLIENT_SECRET=$OKTA_CLIENT_SECRET >> next/.env &&
echo OKTA_ISSUER=$OKTA_ISSUER >> next/.env &&

echo 'Next.js env variables configured'
