/* Copyright 2015 Kudryavtsev Andrey
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace RemoteControl
{
    public partial class RemoteControl : Form
    {
        /// <summary>
        /// Initializing component to work with remote control
        /// </summary>
        public Client client;

        public RemoteControl()
        {
            InitializeComponent();
        }

        private async void onConnectButtonClick(object sender, EventArgs e)
        {
            client = new Client();
            int port = 8888;
            await client.Connect(IpAdress.Text, port);
            
            if (client.connectionState.client.Connected)
            {
                buttonDown.Enabled = true;
                buttonUp.Enabled = true;
                buttonLeft.Enabled = true;
                buttonRight.Enabled = true;
                buttonStop.Enabled = true;
            }
        }

        private void onButtonStopClick(object sender, EventArgs e)
        {
            string script = "direct:brick.stop();";
            client.Send(script.Length + ":" + script);
        }

        private void onButtonUpClick(object sender, EventArgs e)
        {
            string script = "direct:brick.motor(M3).setPower(100);brick.motor(M4).setPower(100);";
            client.Send(script.Length + ":" + script);
        }

        private void onButtonDownClick(object sender, EventArgs e)
        {
            string script = "direct:brick.motor(M3).setPower(-(100));brick.motor(M4).setPower(-(100));";
            client.Send(script.Length + ":" + script);
        }

        private void onButtonLeftClick(object sender, EventArgs e)
        {
            string script = "direct:brick.motor(M3).setPower(-(100));brick.motor(M4).setPower(100);";
            client.Send(script.Length + ":" + script);
        }

        private void onButtonRightClick(object sender, EventArgs e)
        {
            string script = "direct:brick.motor(M3).setPower(100);brick.motor(M4).setPower(-(100));";
            client.Send(script.Length + ":" + script);
        }

        private void RemoteControlFormClosed(object sender, FormClosedEventArgs e)
        {
            this.client.Disconnect();
            Close();
        }
    }
}
