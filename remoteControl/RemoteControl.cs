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
        private Client client;

        public RemoteControl()
        {
            InitializeComponent();
        }

        /// <summary>
        /// Method, that provides connection to remote object by clicking on "Connect" button in form.
        /// Works asynchronously.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private async void OnConnectButtonClick(object sender, EventArgs e)
        {
            client = new Client();
            int port = 8888;
            await client.Connect(IpAdress.Text, port);
            
            if (client.IsConnected())
            {
                buttonDown.Enabled = true;
                buttonUp.Enabled = true;
                buttonLeft.Enabled = true;
                buttonRight.Enabled = true;
                buttonStop.Enabled = true;
            }
        }

        /// <summary>
        /// Method, that stops remote object by clicking "STOP" button.
        /// In TRIK Studio we're sending script with command to do that.
        /// Script should match current protocol.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnButtonStopClick(object sender, EventArgs e)
        {
            string script = "direct:brick.stop();";
            client.Send(script.Length + ":" + script);
        }

        /// <summary>
        /// Method, that sends command move forward to remote object by clicking "↑" button
        /// In TRIK Studio we're sending script with command to do that.
        /// Script should match current protocol.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnButtonUpClick(object sender, EventArgs e)
        {
            string script = "direct:brick.motor(M3).setPower(100);brick.motor(M4).setPower(100);";
            client.Send(script.Length + ":" + script);
        }

        /// <summary>
        /// Method, that sends command move back to remote object by clicking "↓" button
        /// In TRIK Studio we're sending script with command to do that.
        /// Script should match current protocol.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnButtonDownClick(object sender, EventArgs e)
        {
            string script = "direct:brick.motor(M3).setPower(-(100));brick.motor(M4).setPower(-(100));";
            client.Send(script.Length + ":" + script);
        }

        /// <summary>
        /// Method, that sends command turn left to remote object by clicking "←" button
        /// In TRIK Studio we're sending script with command to do that.
        /// Script should match current protocol.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnButtonLeftClick(object sender, EventArgs e)
        {
            string script = "direct:brick.motor(M3).setPower(-(100));brick.motor(M4).setPower(100);";
            client.Send(script.Length + ":" + script);
        }

        /// <summary>
        /// Method, that sends command turn right to remote object by clicking "→" button
        /// In TRIK Studio we're sending script with command to do that.
        /// Script should match current protocol.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void OnButtonRightClick(object sender, EventArgs e)
        {
            string script = "direct:brick.motor(M3).setPower(100);brick.motor(M4).setPower(-(100));";
            client.Send(script.Length + ":" + script);
        }
        
        /// <summary>
        /// This method provides disconnect from remote object, when the form is closed.
        /// Disposing all resources by disconnect method in client class.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void RemoteControlFormClosed(object sender, FormClosedEventArgs e)
        {
            this.client.Disconnect();
            Close();
        }
    }
}
