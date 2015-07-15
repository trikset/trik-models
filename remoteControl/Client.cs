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
using System.Net.Sockets;
using System.IO;
using System.Threading.Tasks;

namespace RemoteControl
{
    /// <summary>
    /// Client class for remote control.
    /// Realizing connect, send and disconnect functions.
    /// </summary>
    public class Client
    {
        /// <summary>
        /// Timeout constants.
        /// </summary>
        private const int connectionTimeout = 2000;
        private const int sendTimeout = 2000;

        /// <summary>
        /// Struct, showing connection state.
        /// </summary>
        private struct ConnectionState
        {
            public TcpClient client;
            public StreamWriter writer;
        }

        /// <summary>
        /// Initializing connection state in Client class. 
        /// That means, that each client class instance instantly have connection state
        /// (empty by default). 
        /// </summary>
        private ConnectionState connectionState = new ConnectionState();

        /// <summary>
        /// Asynchronous connect to remote object
        /// </summary>
        /// <param name="host"> Host adress, we're connecting to </param>
        /// <param name="port"> Port, we're connecting to </param>
        public async Task Connect(string host, int port)
        {
            await ClientAwaitConnection(host, port);
            if (connectionState.client.Connected)
            {
                connectionState.writer = new StreamWriter(connectionState.client.GetStream());
                connectionState.writer.AutoFlush = true;
            }
        }

        /// <summary>
        /// Task for async connect method
        /// </summary>
        /// <param name="host"> Host adress, we're connecting to </param>
        /// <param name="port"> Port, we're connecting to </param>
        /// <returns></returns>
        private Task ClientAwaitConnection(string host, int port)
        {
            connectionState.client = new TcpClient();
            connectionState.client.ReceiveTimeout = connectionTimeout;
            connectionState.client.SendTimeout = sendTimeout;
            return connectionState.client.ConnectAsync(host, port); 
        }

        /// <summary>
        /// Asynchronous send message to remote object
        /// </summary>
        /// <param name="message"> Message, we're sending to object </param>
        public async void Send(string message)
        {
            await ClientAwaitSend(message);
        }

        /// <summary>
        /// Task for async send method
        /// </summary>
        /// <param name="message"> Message, we're sending to object </param>
        /// <returns></returns>
        private Task ClientAwaitSend(string message)
        {
            if (this.connectionState.client.Connected)
            {
                return this.connectionState.writer.WriteLineAsync(message);
            }

            return new Task(() => { });       
        }

        /// <summary>
        /// Disconnect from remote object (synchronously)
        /// </summary>
        public void Disconnect()
        {
            if (this.connectionState.client.Connected)
            {
                this.connectionState.client.Close();
                this.connectionState.writer.Dispose();
            }
        }
        
        /// <summary>
        /// Method, that shows connected or not tcp client to remote object.
        /// </summary>
        /// <returns></returns>
        public bool IsConnected()
        {
            return connectionState.client.Connected;
        }
    }
}
