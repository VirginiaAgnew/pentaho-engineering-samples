#!/bin/sh
#
#  HITACHI VANTARA PROPRIETARY AND CONFIDENTIAL
# 
#  Copyright 2002 - 2017 Hitachi Vantara. All rights reserved.
# 
#  NOTICE: All information including source code contained herein is, and
#  remains the sole property of Hitachi Vantara and its licensors. The intellectual
#  and technical concepts contained herein are proprietary and confidential
#  to, and are trade secrets of Hitachi Vantara and may be covered by U.S. and foreign
#  patents, or patents in process, and are protected by trade secret and
#  copyright laws. The receipt or possession of this source code and/or related
#  information does not convey or imply any rights to reproduce, disclose or
#  distribute its contents, or to manufacture, use, or sell anything that it
#  may describe, in whole or in part. Any reproduction, modification, distribution,
#  or public display of this information without the express written authorization
#  from Hitachi Vantara is strictly prohibited and in violation of applicable laws and
#  international treaties. Access to the source code contained herein is strictly
#  prohibited to anyone except those individuals and entities who have executed
#  confidentiality and non-disclosure agreements or other agreements with Hitachi Vantara,
#  explicitly covering such access.


# *****************************************************************************
#
# Pentaho Data Integration
#
# Copyright (C) 2017 by Hitachi Vantara : http://www.pentaho.com
#
# *****************************************************************************
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with
# the License. You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# *****************************************************************************

echo "************************************************************"
echo " Installing Oracle Java 8"
echo "************************************************************"

JAVA_BASE_VERSION="8"
JAVA_SUB_VERSION="151"
JAVA_BASE_BUILD="12"

JAVA_VERSION="${JAVA_BASE_VERSION}u${JAVA_SUB_VERSION}"
JAVA_BUILD="b${JAVA_BASE_BUILD}"
JAVA_VERSION_WITH_BUILD="${JAVA_VERSION}-${JAVA_BUILD}"

sudo wget --no-cookies --header "Cookie: gpw_e24=xxx; oraclelicense=accept-securebackup-cookie;" "http://download.oracle.com/otn-pub/java/jdk/${JAVA_VERSION_WITH_BUILD}/e758a0de34e24606bca991d704f6dcbf/jdk-${JAVA_VERSION}-linux-x64.rpm"

sudo rpm -i jdk-${JAVA_VERSION}-linux-x64.rpm

sudo /usr/sbin/alternatives --install /usr/bin/java java /usr/java/jdk1.${JAVA_BASE_VERSION}.0_${JAVA_SUB_VERSION}/bin/java 20000

sudo echo "export JAVA_HOME=/usr/java/default" | sudo tee -a /etc/profile.d/set-emr-env.sh
sudo echo "export JAVA_HOME=/usr/java/default" | sudo tee -a /home/hadoop/.bashrc