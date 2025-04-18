export EXT_SOURCE_PATH="/Volumes/Official/Buyerstage/workspace/perpilot-ext-new"
export EXT_OUTPUT_PATH="/Volumes/Official/Buyerstage/build/ext-output"

DOMAIN="$1"

# High Intensity
IBlack='\033[0;90m'       # Black
IRed='\033[0;91m'         # Red
IGreen='\033[0;92m'       # Green
IYellow='\033[0;93m'      # Yellow
IBlue='\033[0;94m'        # Blue
IPurple='\033[0;95m'      # Purple
ICyan='\033[0;96m'        # Cyan
IWhite='\033[0;97m'       # White
NC='\033[0m'

details () {
    echo ""
    echo "* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *"
    echo ""
    echo "EXT_SOURCE_PATH             :   " $EXT_SOURCE_PATH
    echo "EXT_OUTPUT_PATH             :   " $EXT_OUTPUT_PATH
    echo "REQUESTED_SERVER            :   " $DOMAIN
    echo "DATE                        :   " `date`
    echo ""
    echo "* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *"
}

preBuild () {
  echo ""
  echo "***************************** ${IYellow} Generating build for 'https://preapp.buyerstage.io' ${NC}  *****************************"
  echo ""
  cd $EXT_SOURCE_PATH
  # npm install
  REACT_APP_DOMAIN="https://preapp.buyerstage.io" npm run build
  echo ""
  echo ""
  echo "***************************** ${IYellow} Successfully generated build for 'https://preapp.buyerstage.io' ${NC}  *****************************"
  echo ""
}

appBuild () {
    echo ""
	  echo "***************************** ${IYellow} Generating build for 'https://app.buyerstage.io' ${NC}  *****************************"
    echo ""
    cd $EXT_SOURCE_PATH
    # npm install
    REACT_APP_DOMAIN="https://app.buyerstage.io" npm run build
    echo ""
    echo ""
    echo "***************************** ${IYellow} Successfully generated build for 'https://app.buyerstage.io' ${NC}  *****************************"
    echo ""
}

localBuild () {
    echo ""
	  echo "***************************** ${IYellow} Generating build for 'http://localhost:8080'${NC}  *****************************"
    echo ""
    cd $EXT_SOURCE_PATH
    # npm install
    REACT_APP_DOMAIN="http://localhost:8080" npm run build
    echo ""
    echo ""
    echo "***************************** ${IYellow} Successfully generated build for 'http://localhost:8080'${NC}  *****************************"
    echo ""
}

generateBuild () {

    cd $EXT_OUTPUT_PATH
    rm -rf Buyerstage_Ext
    rm Buyerstage.zip

    cd $EXT_SOURCE_PATH
    mkdir Buyerstage_Ext
    cp -r build/* Buyerstage_Ext
    mv Buyerstage_Ext $EXT_OUTPUT_PATH

    cd $EXT_OUTPUT_PATH
    zip -r Buyerstage.zip Buyerstage_Ext
    echo ""
    echo "***************************** ${IPurple} Build available now in $EXT_SOURCE_PATH  ${NC} *****************************"
    echo ""
    # open .
}

if [ ! -z "$1" ] && [ $1 == "pre" ] ; then
    details
    preBuild
    generateBuild
fi

if [ ! -z "$1" ] && [ $1 == "app" ] ; then
    details
    appBuild
    generateBuild
fi

if [ ! -z "$1" ] && [ $1 == "local" ] ; then
    details
    localBuild
    generateBuild
fi
